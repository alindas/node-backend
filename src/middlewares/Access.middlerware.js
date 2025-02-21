const { appLogger } = require("@/core/log");
const uuid = require("uuid");

const accessLogger = async (ctx, next) => {
  const start = Date.now();
  // 生成一个长度为8的随机字符串
  const requestId = uuid.v4().slice(0, 8);
  appLogger.info(`[${requestId}] ${ctx.method} ${ctx.url} `);

  await next();
  const ms = Date.now() - start;
  appLogger.info(`[${requestId}] ${ctx.method} ${ctx.url} - ${ms}ms`);
};

module.exports = accessLogger;
