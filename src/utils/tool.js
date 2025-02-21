const IP2Region = require("ip2region").default;
const jwt = require("jsonwebtoken");
const SYSTEM = require("@/constants/cache");
const { Op } = require("sequelize");
const redis = require("@/core/redis");

const Tools = {
  /**
   * ip转国内地址
   * @param {*} ip
   * @returns
   */
  getGeoLocationByIp(ip) {
    const query = new IP2Region();
    const ipAddress = query.search(ip);
    if (ipAddress.isp === "内网IP") {
      return "内网IP";
    }
    return ipAddress.country + ipAddress.province + ipAddress.city + ipAddress.isp;
  },

  /**
   * jwt工具
   * 生成token
   * 验证token
   */
  jwtTools: {
    generateToken: payload => {
      return jwt.sign(payload, SYSTEM.SECRET, {
        expiresIn: SYSTEM.CACHE_TTL.TOKEN_EXPIRES_IN,
      });
    },
    verifyToken: token => {
      return jwt.verify(token, SYSTEM.SECRET);
    },
  },

  /**
/**
 * 构建树
 * @param {*} items 数据
 * @param {*} idKey 主键
 * @param {*} parentKey 父级主键
 * @param {*} childrenKey 子级
 * @param {*} labelKey 名称
 * @param {*} pid 父级id
 * @returns
   */
  buildTree(params) {
    const {
      items,
      idKey = "id",
      parentKey = "parentId",
      childrenKey = "children",
      labelKey = "label",
      pid = 0,
    } = params;
    const itemMap = new Map();
    // 初始化节点映射
    items.forEach(item => {
      item[childrenKey] = [];
      itemMap.set(item[idKey], item);
    });
    const tree = [];
    // 构建树
    items.forEach(item => {
      const parentId = item[parentKey];
      if (parentId === null || parentId === undefined || parentId === pid) {
        // 根节点
        tree.push({
          id: item[idKey],
          parentId: item[parentKey],
          label: item[labelKey],
          ...item,
        });
      } else if (itemMap.has(parentId)) {
        // 子节点
        itemMap.get(parentId)[childrenKey].push({
          id: item[idKey],
          parentId: item[parentKey],
          label: item[labelKey],
          ...item,
        });
      }
    });

    return tree;
  },
  /**
   * 获取用户查询条件
   * @param {*} ctx  接受 ctx|dto user|userName
   * @returns
   */
  async getUserCondition(params) {
    let belongUsers = [];
    if (params?.state?.user) {
      belongUsers = params.state.user.belongUsers;
    }
    if (params?.userName) {
      const userinfo = await redis.get(SYSTEM.CACHE_KEY.USER_ROLE_INFO + params.userName);
      if (userinfo) {
        belongUsers = userinfo.belongUsers;
      }
    }
    if (typeof params === "string") {
      const userinfo = await redis.get(SYSTEM.CACHE_KEY.USER_ROLE_INFO + params);
      if (userinfo) {
        belongUsers = userinfo.belongUsers;
      }
    }

    if (belongUsers.length > 0) {
      return {
        [Op.or]: [
          {
            createBy: {
              [Op.in]: belongUsers,
            },
          },
          {
            updateBy: {
              [Op.in]: belongUsers,
            },
          },
        ],
      };
    }
    return {};
  },
  // 获取静态资源地址
  getAssetsUrl(path) {
    return SYSTEM.ASSETS_PREFIX + path;
  },
};

module.exports = Tools;
