const { appLogger } = require("@/core/log");
const { pipeAsync } = require("@/utils/functional");
const { generateKeyPem } = require("@/utils/pem");
const initMiddleware = require("@/core/bootstrap/middleware");
const { initOther, initConfig } = require("@/core/bootstrap/other");
const { initRedis, initDatabase } = require("@/core/bootstrap/database");
const config = require("@/config");

const bootstrap = async app => {
  const appName = config.get("app.name");
  appLogger.info(`==========${appName} ${process.env.NODE_ENV}============`);
  // 使用 pipeAsync，函数执行顺序从左到右
  const initApp = pipeAsync(initConfig, initDatabase, initRedis, initMiddleware, initOther);
  // 初始化秘钥私钥
  generateKeyPem();
  await initApp(app);
  appLogger.info("Application initialized successfully");
  return app;
};

module.exports = bootstrap;
