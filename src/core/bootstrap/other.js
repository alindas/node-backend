const configService = require("@/modules/system/config/configService");
const dictService = require("@/modules/system/dict/dictService");
const config = require("@/config");
const { appLogger } = require("@/core/log");
// 在初始化时加载配置
const initConfig = app => {
  /**
   * 给 koa 实例上下文添加 config 对象，context 上下文可在整个应用程序间共享数据
   * 所有的中间件和路由处理函数都可以访问到 context 对象
   */
  app.context.config = config;
  appLogger.info("Configuration initialized successfully");
  return app;
};
const initOther = async () => {
  await configService.init(); // 配置服务
  await dictService.init(); // 字典服务
};

module.exports = { initOther, initConfig };
