const DB = require("@/core/database");
const { appLogger } = require("@/core/log");
const redis = require("@/core/redis");

const initRedis = async app => {
  try {
    redis.connect();
    appLogger.info("Redis initialized successfully");
    return app;
  } catch (error) {
    appLogger.error("Failed to initialize Redis:", error);
    throw error;
  }
};

// const { registerAuditHooks } = require("../database/hooks");

const initDatabase = async app => {
  // 初始化数据库连接
  await DB.init();

  return app;
};

module.exports = { initRedis, initDatabase };
