const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { CACHE_KEY } = require("@/constants/cache");
const SYSTEM = require("@/constants/cache");
const { ErrorCode } = require("@/constants/stateCode");
const {
  SysUser,
  SysRole,
  SysDept,
  SysPost,
  SysUserPost,
  SysUserRole,
  SysRoleDept,
} = require("@/core/database/models");
const redis = require("@/core/redis");
const AppError = require("@/utils/AppError");
const { buildTree } = require("@/utils/tool");

class UserService {
  // 用户属性
  attr = [
    "userId",
    "userName",
    "sex",
    "nickName",
    "email",
    "phonenumber",
    "status",
    "deptId",
    "avatar",
    "remark",
    "createTime",
  ];

  constructor() {
    this.datascope = {
      // 全部数据
      all: 1,
      // 仅自定义数据权限
      custom: 2,
      // 本部门
      dept: 3,
      // 本部门及子部门
      deptAndChild: 4,
      // 仅本人数据权限
      self: 5,
    };
  }

  // 从redis删除用户信息
  async deleteUserInfo(userId) {
    const user = await SysUser.findOne({ where: { userId } });
    const key = SYSTEM.USER_KEY + user.userName;
    await redis.del(key);
  }

  // 获取通过用户id获取用户信息
  async getUserInfoByUserId(userId) {
    const user = await SysUser.findOne({
      attributes: this.attr,
      where: { userId },
      include: [
        {
          model: SysDept,
          attributes: ["deptName", "deptId"],
        },
      ],
    });
    const roles = await SysRole.findAll({
      attributes: ["roleName", "roleKey", "roleId", "dataScope"],
      include: [
        {
          model: SysUser,
          attributes: [],
          through: { attributes: [] },
          where: {
            userId: user.userId,
          },
        },
      ],
    });

    const posts = await SysPost.findAll({
      attributes: ["postName", "postCode", "postId"],
      include: [
        {
          model: SysUser,
          through: { attributes: [] },
          attributes: [],
          where: {
            userId: user.userId,
          },
        },
      ],
    });

    const res = {
      ...user,
      roles,
      posts,
      dept: user.SysDepts,
    };
    return res;
  }

  // 获取用户列表
  async getUserList(params, ctx) {
    const where = {
      delFlag: 0,
      ...ctx.condition,
    };

    if (params.userName) {
      where.userName = { [Op.like]: `%${params.userName}%` };
    }
    if (params.phonenumber) {
      where.phonenumber = { [Op.like]: `%${params.phonenumber}%` };
    }
    if (params.status) {
      where.status = params.status;
    }
    if (params["params[beginTime]"] && params["params[endTime]"]) {
      where.createTime = {
        [Op.between]: [params["params[beginTime]"], params["params[endTime]"]],
      };
    }
    if (params.deptId) {
      const allDept = await SysDept.findAll({ where: { delFlag: 0 } });
      const childDeptIds = this.findChildDept(allDept, params.deptId.split(",").map(Number));
      where.deptId = { [Op.in]: childDeptIds };
    }
    const page = params.pageNum || 1;
    const size = params.pageSize || 10;
    const user = await SysUser.findAndCountAll({
      attributes: this.attr,
      where,
      distinct: true,
      include: [
        {
          model: SysDept,
          attributes: ["deptName", "deptId"],
        },
      ],
      offset: (page - 1) * size,
      limit: +size,
    });

    const rows = user.rows.map(row => {
      return {
        ...row,
        ...row.SysRoles,
        ...row.SysPosts,
        ...row.SysDepts,
      };
    });
    return [rows, user.count];
  }

  // 获取用户信息
  async getUserInfo(params) {
    const { userId } = params;
    let user = {};
    let postIds = [];
    let roleIds = [];
    if (userId) {
      user = await SysUser.findOne({
        attributes: this.attr,
        where: { userId },
      });
      const posts = await SysUserPost.findAll({ where: { userId } });
      const roles = await SysUserRole.findAll({ where: { userId } });
      postIds = posts.map(post => post.postId);
      roleIds = roles.map(role => role.roleId);
    }
    const posts = await SysPost.findAll();
    const roles = await SysRole.findAll({
      attributes: ["roleId", "roleName", "roleKey"],
    });

    return { user, posts, roles, postIds, roleIds };
  }

  // 删除用户
  async deleteUser(params) {
    const { userIds } = params;
    const ids = userIds.split(",");
    // 删除用户角色关联
    await SysUserRole.destroy({
      where: { userId: { [Op.in]: ids } },
    });
    // 删除用户岗位关联
    await SysUserPost.destroy({
      where: { userId: { [Op.in]: ids } },
    });
    // 删除用户
    await Promise.all(ids.map(id => SysUser.destroy({ where: { userId: id } })));
  }

  // 密码加密
  encryptPassword = async password => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error("Failed to hash password");
    }
  };

  // 修改用户信息
  async updateUserInfo(params) {
    delete params.password;
    const { userId, postIds, roleIds, ...userInfo } = params;
    // 更新户信息
    await SysUser.update(userInfo, { where: { userId } });
    // 更新用户岗位关联
    if (postIds) {
      await SysUserPost.destroy({ where: { userId } });
      await SysUserPost.bulkCreate(postIds.map(postId => ({ userId, postId })));
    }
    // 更新用户角色关联
    if (roleIds) {
      await SysUserRole.destroy({ where: { userId } });
      await SysUserRole.bulkCreate(roleIds.map(roleId => ({ userId, roleId })));
    }
    // 删除redis中的用户信息
    this.deleteUserInfo(userId);
  }

  // 获取部门树
  async getDeptTree() {
    const depts = await SysDept.findAll({ where: { delFlag: 0 } });
    const tree = buildTree({
      items: depts,
      idKey: "deptId",
      parentKey: "parentId",
      childrenKey: "children",
      pid: 0,
      labelKey: "deptName",
    });
    return tree;
  }

  // 新增用户
  async addUser(params) {
    const { postIds, roleIds, ...userInfo } = params;
    userInfo.password = await this.encryptPassword(userInfo.password);
    const res = await SysUser.create(userInfo);
    if (postIds) {
      await SysUserPost.bulkCreate(postIds.map(postId => ({ userId: res.userId, postId })));
    }
    // 更新用户角色关联
    if (roleIds) {
      await SysUserRole.bulkCreate(roleIds.map(roleId => ({ userId: res.userId, roleId })));
    }
  }

  // 重置密码
  async resetPwd(params) {
    const { userId, password } = params;
    const pwd = password || CACHE_KEY.SYSTEM.BASE_PWD;
    const hashedPassword = await this.encryptPassword(pwd);
    await SysUser.update({ password: hashedPassword }, { where: { userId } });
    // 删除redis中的用户信息
    this.deleteUserInfo(userId);
    return pwd;
  }

  // 修改用户状态
  async changeStatus(params) {
    const { userId, status } = params;
    await SysUser.update({ status }, { where: { userId } });
    // 删除redis中的用户信息
    this.deleteUserInfo(userId);
  }

  // 获取授权角色
  async getAuthRole(params) {
    const { userId } = params;
    const roles = await SysRole.findAll({
      attributes: ["roleId", "roleName", "roleKey"],
      include: [
        {
          model: SysUser,
          where: { userId },
          attributes: ["userId", "userName", "nickName"],
        },
      ],
    });
    const user = await SysUser.findOne({
      attributes: ["userName", "userId", "nickName"],
      where: { userId },
    });
    // 删除redis中的用户信息
    this.deleteUserInfo(userId);
    return [roles.map(role => ({ ...role.SysUsers, ...role, user })), user];
  }

  // 编辑授权角色
  async editAuthRole(params) {
    const { userId, roleIds } = params;
    if (roleIds) {
      await SysUserRole.destroy({ where: { userId } });
      await SysUserRole.bulkCreate(roleIds.split(",").map(roleId => ({ userId, roleId })));
      // 删除redis中的用户信息
      this.deleteUserInfo(userId);
    }
  }

  // 获取个人信息
  async getProfile(params) {
    const { userId } = params;
    const user = await this.getUserInfoByUserId(userId);
    const roleGroup = user.roles.map(role => role.roleName).join("/");
    const postGroup = user.posts.map(post => post.postName).join("/");
    return { user, roleGroup, postGroup };
  }

  // 修改个人信息
  async profileEdit(params) {
    const { userId, ...userInfo } = params;
    await SysUser.update(userInfo, { where: { userId } });
    // 删除redis中的用户信息
    this.deleteUserInfo(userId);
    // this.getUserInfoByUserId(userId).then((res) => {});
  }

  // 修改密码
  async changePwd(params) {
    // 比较密码
    const comparePassword = async (password, hashPassword) => {
      const flag = await bcrypt.compare(password, hashPassword);
      return flag;
    };
    const { userId, oldPassword, newPassword } = params;
    const user = await SysUser.findOne({ where: { userId } });
    if (!(await comparePassword(oldPassword, user.password))) {
      throw new AppError(ErrorCode.PARAM_ERROR, "旧密码错误");
    }
    const hashedPassword = await this.encryptPassword(newPassword);
    // 更新用户密码
    await SysUser.update({ password: hashedPassword }, { where: { userId } });
    // 删除redis中的用户信息
    this.deleteUserInfo(userId);
  }

  // 获取当前用户可以查询的name
  async getBelongName(user) {
    const roles = await SysUserRole.findAll({ where: { userId: user.userId } });
    const allDepts = await SysDept.findAll({ where: { delFlag: 0 } });
    const belongNames = new Set();
    if (roles.map(role => role.roleId).includes(1)) {
      const allUsers = await SysUser.findAll({ where: { delFlag: 0 } });
      allUsers.forEach(t => belongNames.add(t.userName));
      return Array.from(belongNames);
    }

    for (const role of roles) {
      const roleDataScope = role.dataScope;
      switch (roleDataScope) {
        case this.datascope.all: {
          allDepts.forEach(dept => belongNames.add(dept.deptName));
          break;
        }
        case this.datascope.custom: {
          const roleDepts = await SysRoleDept.findAll({ where: { roleId: role.roleId } });
          const deptIds = roleDepts.map(dept => dept.deptId);
          const depts = await SysDept.findAll({ where: { deptId: { [Op.in]: deptIds } } });
          depts.forEach(dept => belongNames.add(dept.deptName));
          break;
        }
        case this.datascope.dept: {
          const currUsers = await SysUser.findAll({ where: { deptId: user.deptId } });
          currUsers.forEach(i => belongNames.add(i.userName));
          break;
        }
        case this.datascope.deptAndChild: {
          const childDeptIds = this.findChildDept(allDepts, [user.deptId]);
          const users = await SysUser.findAll({ where: { deptId: { [Op.in]: childDeptIds } } });
          users.forEach(l => belongNames.add(l.userName));
          break;
        }
        case this.datascope.self: {
          belongNames.add(user.userName);
          break;
        }
        default:
          break;
      }
    }
    belongNames.add(user.userName);
    return Array.from(belongNames);
  }

  findChildDept(allData, ids) {
    // 找到用户部门下的子部门
    const result = new Set(ids); // 初始化Set包含父部门ID
    for (const id of ids) {
      const childDepts = allData.filter(dept => dept.parentId === id);
      if (childDepts.length > 0) {
        // 添加直接子部门的ID
        childDepts.forEach(dept => result.add(dept.deptId));
        // 递归查找子部门的子部门
        const childIds = childDepts.map(dept => dept.deptId);
        const subDeptIds = this.findChildDept(allData, childIds);
        // 添加所有子孙部门的ID
        subDeptIds.forEach(d => result.add(d));
      }
      result.add(id);
    }

    return Array.from(result);
  }
}

module.exports = new UserService();
