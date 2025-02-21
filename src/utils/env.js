/**
 * 环境常量
 */
const ENV = {
  DEV: "development",
  PROD: "production",
  TEST: "test",
};

/**
 * 获取当前环境
 */
const getEnv = () => process.env.NODE_ENV || ENV.DEV;

/**
 * 环境判断函数
 */
const isDev = () => getEnv() === ENV.DEV;
const isProd = () => getEnv() === ENV.PROD;
const isTest = () => getEnv() === ENV.TEST;

module.exports = {
  ENV,
  getEnv,
  isDev,
  isProd,
  isTest,
};
