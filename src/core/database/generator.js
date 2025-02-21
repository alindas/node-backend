const fs = require("fs");
const path = require("path");
const SequelizeAuto = require("sequelize-auto");
const { sqlLogger: logger } = require("../log");

const options = {
  directory: path.join(__dirname, "models"), // 输出模型文件的目录
  caseFile: "l", // 文件名使用小写
  caseModel: "p", // 模型名使用帕斯卡命名
  caseProp: "c", // 属性使用驼峰命名
  additional: {
    timestamps: false, // 默认不启用时间戳
    paranoid: false, // 禁用软删除
    underscored: true, // 字段使用下划线命名
    freezeTableName: true, // 使用原始表名
    comment: true,
  },
  lang: "js",
  singularize: false,
  pluralize: false,
  useDefine: true,
  skipTables: ["migrations", "sequelizemeta"],
  // 表名前缀
  tablePrefix: ["sys_", "gen_"],
  // 生成关联关系
  noInitModels: false,
  // 生成外键关联
  noAlias: false,
  // 重要：禁用时间戳相关配置
  removeCols: ["deleted_at"],
  // 使用实际的列名
  noDefaults: true,
  // 不生成验证
  noValidation: true,
  // 不生成默认值
  noDefaultValueOnNull: true,
};

/**
 * 生成所有模型
 * @param {Sequelize} sequelize
 */
async function generateModels(sequelize) {
  try {
    // 确保 models 目录存在
    const modelsDir = path.join(__dirname, "models");
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    const auto = new SequelizeAuto(
      sequelize.config.database,
      sequelize.config.username,
      sequelize.config.password,
      {
        ...options,
        host: sequelize.config.host,
        port: sequelize.config.port,
        dialect: sequelize.config.dialect || "mysql",
      },
    );

    await auto.run();
    logger.info("Models generated successfully");
  } catch (error) {
    logger.error("Failed to generate models:", error);
    throw error;
  }
}
/**
 * 根据表名生成模型
 * @param {Sequelize} sequelize
 * @param {string} table 表名
 */
async function generateModelsByTable(sequelize, table) {
  const auto = new SequelizeAuto(
    sequelize.config.database,
    sequelize.config.username,
    sequelize.config.password,
    {
      ...options,
      host: sequelize.config.host,
      port: sequelize.config.port,
      dialect: sequelize.config.dialect || "mysql",
      tables: [table],
    },
  );

  await auto.run();
  logger.info("Models generated successfully");
}
module.exports = { generateModels, generateModelsByTable };
