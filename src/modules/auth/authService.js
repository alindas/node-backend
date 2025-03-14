const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const svgCaptcha = require("svg-captcha");
const { v4: uuidv4 } = require("uuid");
const SYSTEM = require("@/constants/cache");
const { ErrorCode } = require("@/constants/stateCode");
const models = require("@/core/database/models");
const redis = require("@/core/redis");
const AppError = require("@/utils/AppError");
// const { validateKeyPem } = require("@/utils/pem");
const { jwtTools } = require("@/utils/tool");
const fs = require("fs");
const path = require("path");
const Tools = require("@/utils/tool");

class AuthService {
  // 生成验证码
  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 120,
      height: 40,
      background: "#cc9966",
    });
    /**
     * Buffer 对象是一个包含原始二进制数据的固定大小的数组。
     * 每个元素占用一个字节（8位），因此 Buffer 适合处理二进制数据，如文件内容、网络数据包
     * 虽然 Buffer 对象的内容可以在创建后修改，但其长度是固定的，不能动态改变
     * 常见的支持解析编码：base64\hex\utf8\ascii
     */
    const imageBase64 = Buffer.from(captcha.data).toString("base64");
    const img = `data:image/svg+xml;base64,${imageBase64}`;
    const uuid = uuidv4();
    // 保存验证码到Redis
    // setex 是 redis set&expire的合并，用于设置一个键值对，并指定过期时间
    await redis.setex(
      `${SYSTEM.CAPTCHA_KEY}${uuid}`,
      SYSTEM.CACHE_TTL.CAPTCHA_CODE_KEY, // 1分钟过期
      captcha.text.toLowerCase(),
    );

    return {
      uuid,
      img,
      text: captcha.text,
    };
  }

  // 验证登录
  async validateLogin({ username, password, code, uuid }, ctx) {
    console.log("validateLogin", username, password, code, uuid)
    // 验证码校验
    const validateCaptcha = async () => {
      const cacheCode = await redis.get(`${SYSTEM.CAPTCHA_KEY}${uuid}`);
      if (!cacheCode) {
        throw new AppError(ErrorCode.CAPTCHA_EXPIRED, "验证码已过期");
      }
      const sessionCode = ctx.session.captcha;
      if (sessionCode && sessionCode.toLowerCase() !== code.toLowerCase()) {
        throw new AppError(ErrorCode.CAPTCHA_ERROR, "验证码错误");
      }
      if (code.toLowerCase() !== cacheCode) {
        throw new AppError(ErrorCode.CAPTCHA_ERROR, "验证码错误");
      }
      return true;
    };
    // 校验是否在黑名单
    const checkBlacklist = async () => {
      const blacklist = await redis.get(`${SYSTEM.SYS_CONFIG_KEY}sys.login.blackIPList`);
      const blackListArr = blacklist.split(";");
      const { ip } = ctx;
      if (blackListArr.includes(ip)) {
        throw new AppError(ErrorCode.BLACKLIST_IP, "此ip在黑名单中");
      }
      return true;
    };
    // 比较密码
    const comparePassword = async (originalPassword, hashPassword) => {
      /**
       * bcrypt 使用单向哈希算法，它只能将密码转换为哈希值，无法从哈希值还原出原始密码
       */
      const flag = await bcrypt.compare(originalPassword, hashPassword);
      return flag;
    };
    // 检查重试次数 检查用户是否被锁定
    const checkRetryCount = async () => {
      const count = await redis.get(`${SYSTEM.RETRY_COUNT}${username}`);
      if (count >= SYSTEM.PWD_RETRY_CNT) {
        redis.set(`${SYSTEM.LOCKED_USER}${username}`, true);
        throw new AppError(ErrorCode.USER_LOCKED, "账号已被锁定，请稍后再试");
      }
      return count || 0;
    };

    // 验证用户
    const validateUser = async (name, pwd) => {
      const user = await models.SysUser.findOne({
        where: {
          user_name: name,
          del_flag: "0",
        },
      });

      if (!user) {
        throw new AppError(ErrorCode.USER_NOT_FOUND, "用户不存在");
      }
      // 解密密码
      const newPassword = pwd;

      // 如前端没使用公钥加密 则注释此行代码
      // newPassword = validateKeyPem(password);

      // 比较密码 暂时放开
      // if (!(await comparePassword(newPassword, user.password))) {
      //   throw new AppError(ErrorCode.USER_PASSWORD_ERROR, "密码错误");
      // }

      if (user.status !== "0") {
        throw new AppError(ErrorCode.USER_DISABLED, "用户已被禁用");
      }

      return user;
    };

    // 生成token
    const createLoginToken = async user => {
      const uidToken = uuidv4();
      await redis.setex(
        `${SYSTEM.TOKEN_KEY}${uidToken}`,
        SYSTEM.CACHE_TTL.TOKEN_EXPIRES_IN,
        user.userId,
      );
      const token = jwtTools.generateToken({
        id: user.userId,
        username: user.userName,
        uuid: uidToken,
      });
      return { token, user };
    };

    try {
      // 验证码校验
      // await validateCaptcha()
      // 检查重试次数
      const retryCount = await checkRetryCount();
      // 验证用户
      const user = await validateUser(username, password);
      // 检查黑名单
      await checkBlacklist();
      // 生成token
      const result = await createLoginToken(user);
      // 清除重试次数
      if (retryCount > 0) {
        await redis.del(`${SYSTEM.RETRY_COUNT}${username}`);
      }

      return result;
    } catch (error) {
      // 增加重试次数
      const retryCount = await redis.get(`${SYSTEM.RETRY_COUNT}${username}`);
      await redis.set(`${SYSTEM.RETRY_COUNT}${username}`, (parseInt(retryCount, 10) || 0) + 1);
      throw error;
    }
  }

  // 获取用户角色信息
  async getUserRole(userId) {
    const roleIds = await models.SysUserRole.findAll({
      attributes: ["roleId"],
      where: {
        userId,
      },
    });
    const roles = await models.SysRole.findAll({
      where: {
        roleId: roleIds.map(item => item.roleId),
      },
    });
    return [roles.map(item => item.roleName), roles.map(item => item.roleId)];
  }

  // 获取用户信息
  async getUserInfo(user) {
    // SysUser  SysRole SysPost
    // SysUser 和 SysRole 的关联在SysUserRole
    // SysUser 和  SysPost 的关联在SysUserPost 关联查询
    const [roles, roleIds] = await this.getUserRole(user.userId);
    const permissions = await this.getPermissions(roleIds);
    return {
      role: roles,
      permissions,
    };
  }

  // 获取用户权限
  async getPermissions(roleIds) {
    // 确认用户是不是超级管理员
    const isSuperAdmin = roleIds.includes(1);
    if (isSuperAdmin) {
      return ["*:*:*"];
    }
    const permissions = new Set();
    for (const roleId of roleIds) {
      const menus = await models.SysMenu.findAll({
        include: [
          {
            model: models.SysRole,
            where: { roleId },
          },
        ],
      });
      menus.forEach(menu => {
        if (menu.perms) {
          menu.perms.split(",").forEach(perm => permissions.add(perm));
        }
      });
    }

    return Array.from(permissions);
  }

  // 获取用户菜单
  async getMenusByUserId(userId) {
    // 1. 获取用户角色
    const roleIds = await models.SysUserRole.findAll({
      attributes: ["roleId"],
      where: { userId },
      raw: true,
    });
    if (!roleIds.length) {
      return [];
    }
    // 2 判断用户是不是超级管理员
    const isSuperAdmin = roleIds.some(item => item.roleId === 1);
    let menus = [];
    if (isSuperAdmin) {
      menus = await models.SysMenu.findAll({
        where: { status: "0", menuType: { [Op.in]: ["M", "C"] } },
        order: [["orderNum", "DESC"]],
      });
    } else {
      // 3. 获取角色对应的菜单
      menus = await models.SysMenu.findAll({
        where: { status: "0", menuType: { [Op.in]: ["M", "C"] } },
        include: [
          {
            model: models.SysRole,
            attributes: [],
            through: {
              attributes: [],
            },
            where: { roleId: roleIds.map(item => item.roleId) },
          },
        ],
        raw: true,
        nest: true,
        order: [["orderNum", "DESC"]],
      });
    }
    // 用户多个角色 去重
    const menuSet = new Set();
    const result = [];
    menus.forEach(menu => {
      if (menuSet.has(menu.menuId)) {
        return;
      }
      menuSet.add(menu.menuId);
      result.push(menu);
    });
    return result;
  }

  // 转换菜单格式
  transformMenuTree(menuTree) {
    menuTree.sort((a, b) => a.orderNum - b.orderNum);
    return menuTree.map(menu => this.transformMenuItem(menu));
  }

  // 转换单个菜单项
  transformMenuItem(menu) {
    const baseTransform = {
      path: this.getMenuPath(menu),
      name: this.formatMenuName(menu.menuName),
      meta: this.buildMenuMeta(menu),
      children: menu.children?.length ? this.transformMenuTree(menu.children) : [],
    };

    // 添加组件配置
    if (menu.component) {
      baseTransform.component = `/${menu.component}`;
    }

    // 处理外链
    if (menu.isFrame === 0) {
      baseTransform.path = menu.path;
      delete baseTransform.component;
    }

    // 处理子菜单的 activeMenu
    if (baseTransform.children.length) {
      baseTransform.children = this.addActiveMenuToChildren(
        baseTransform.children,
        baseTransform.path,
      );
    }

    return baseTransform;
  }

  // 构建菜单元数据
  buildMenuMeta(menu) {
    return {
      icon: menu.icon,
      title: menu.menuName,
      isLink: menu.isFrame === 0 ? menu.path : "",
      isHide: menu.visible === "1",
      isFull: false,
      isAffix: menu.menuName.includes("首页"),
      isKeepAlive: menu.isCache === 1,
    };
  }

  // 格式化菜单名称
  formatMenuName(name) {
    return name.toLowerCase().replace(/\s+/g, "");
  }

  // 获取菜单路径
  getMenuPath(menu) {
    return menu.isFrame === 0 ? menu.path : `/${menu.path}`;
  }

  // 添加 activeMenu 到子菜单
  addActiveMenuToChildren(children, parentPath) {
    return children.map(child => ({
      ...child,
      children: child.children?.length
        ? child.children.map(grandChild => ({
            ...grandChild,
            meta: {
              ...grandChild.meta,
              activeMenu: parentPath,
            },
          }))
        : [],
    }));
  }

  // 获取路由信息
  async getRouters(userId) {
    const menus = await this.getMenusByUserId(userId);
    const menuTree = Tools.buildTree({
      items: menus,
      idKey: "menuId",
      parentKey: "parentId",
      childrenKey: "children",
      labelKey: "menuName",
      pid: 0,
    });
    return this.transformMenuTree(menuTree);
  }

  // 退出登录
  async logOut(user) {
    const { userName, uuid } = user;
    await redis.del(`${SYSTEM.TOKEN_KEY}${uuid}`);
    await redis.del(`${SYSTEM.USER_KEY}${userName}`);
  }

  // 获取公钥
  async getPublicKey() {
    const data = fs.readFileSync(
      path.resolve(__dirname, "../../public/rsa_public_key.pem"),
      "utf-8",
    );
    return data;
  }
}

module.exports = new AuthService();
