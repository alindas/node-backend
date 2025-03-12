const R = require("ramda");
const { appLogger } = require("@/core/log");

/**
 * 函数管道
 * 从左到右执行函数
 * @param  {...Function} fns 要组合的函数
 */
const { pipe } = R;

/**
 * 异步函数管道
 * @param  {...Function} fns 要组合的异步函数
 */
const pipeAsync =
  (...fns) =>
  x =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(x)); // 空数组必须传递初始值

module.exports = {
  pipe,
  pipeAsync,
};
