const config = require("../../config");
const { getEnv } = require("../../utils/env");

// 从yml配置中获取Redis配置
const redisConfig = config.get("redis");

// 通用配置
const commonConfig = {
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  // 开发环境启用debug日志
  showFriendlyErrorStack: getEnv() === "development",
  // 自动处理断线重连
  autoResubscribe: true,
  autoResendUnfulfilledCommands: true,
  lazyConnect: true,
  db: redisConfig.db || 0,
};

// 合并配置
module.exports = {
  ...commonConfig,
  ...redisConfig,
};
