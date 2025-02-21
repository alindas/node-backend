const { ErrorCode } = require("@/constants/stateCode");
const AppError = require("@/utils/AppError");

/**
 * 全局错误处理中间件
 */
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 处理自定义应用错误
    console.log(err);
    if (err instanceof AppError) {
      ctx.status = 200; // 业务错误统一返回200
      ctx.body = err.toJSON();
      return;
    }

    // 处理数据库错误
    if (err.name === "SequelizeError") {
      ctx.status = 200;
      ctx.body = {
        code: ErrorCode.DATABASE_ERROR.code,
        message: "数据库操作失败",
        details: process.env.NODE_ENV === "development" ? err.message : null,
      };
      return;
    }

    // 处理验证错误
    if (err.name === "ValidationError") {
      ctx.status = 200;
      ctx.body = {
        code: ErrorCode.PARAM_ERROR.code,
        message: "参数验证失败",
        details: err.details,
      };
      return;
    }

    // 未知错误处理
    ctx.status = err.status || 500;
    ctx.body = {
      code: ErrorCode.SYSTEM_ERROR.code,
      message: "系统内部错误",
      details: process.env.NODE_ENV === "development" ? err.message : null,
    };
  }
};

/**
 * 404错误处理
 */
const notFoundHandler = async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    ctx.status = 200;
    ctx.body = {
      code: ErrorCode.RESOURCE_NOT_FOUND.code,
      message: "请求的资源不存在",
    };
  }
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
