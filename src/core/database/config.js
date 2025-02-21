const config = require("../../config");
const { getEnv } = require("../../utils/env");
const { logger } = require("../log");
// 从yml配置中获取数据库配置
const dbConfig = config.get("database");

// 通用配置
const commonConfig = {
  dialect: "mysql",
  timezone: "+08:00",
  define: {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
  // 默认查询配置
  query: {
    raw: true, // 始终返回原始数据
    nest: true, // 嵌套关联数据
  },
  hooks: {
    // 添加全局钩子来确保选项被应用
    beforeFind: options => {
      options.raw = true;
      options.nest = true;
    },
    // beforeCreate: (instance, options) => {
    //   // 从 options 中获取当前用户信息
    //   const currentUser = options.currentUser;
    //   if (currentUser) {
    //     instance.createBy = currentUser.userName;
    //     instance.createTime = new Date();
    //   }
    // },
    // beforeUpdate: (instance, options) => {
    //   const currentUser = options.currentUser;
    //   if (currentUser) {
    //     instance.updateBy = currentUser.userName;
    //     instance.updateTime = new Date();
    //   }
    // },
    // beforeBulkCreate: (instances, options) => {
    //   const currentUser = options.currentUser;
    //   if (currentUser) {
    //     instances.forEach((instance) => {
    //       instance.createBy = currentUser.userName;
    //       instance.createTime = new Date();
    //     });
    //   }
    // },
    // beforeBulkUpdate: (options) => {
    //   const currentUser = options.currentUser;
    //   if (currentUser) {
    //     options.fields.push("updateBy", "updateTime");
    //     options.attributes.updateBy = currentUser.userName;
    //     options.attributes.updateTime = new Date();
    //   }
    // },
  },
  // 连表查询
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging:
    getEnv() === "development"
      ? sql => {
          logger.sql(sql);
        }
      : false,
};

// 合并配置
module.exports = {
  ...commonConfig,
  ...dbConfig,
};
