const configService = require("@/modules/system/config/configService");
const dictService = require("@/modules/system/dict/dictService");
const config = require("@/config");
const { appLogger } = require("@/core/log");
// 在初始化时加载配置
const initConfig = app => {
  app.context.config = config;
  appLogger.info("Configuration initialized successfully");
  return app;
};
const initOther = async () => {
  await configService.init();
  await dictService.init();
};

module.exports = { initOther, initConfig };
