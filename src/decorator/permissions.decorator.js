const { ErrorCode } = require("@/constants/stateCode");
const AppError = require("@/utils/AppError");

/**
 * 权限判断装饰器
 * @param {String} permissions 权限标识
 * @returns {Function} 装饰器函数
 */
function HasPermissions(per) {
  return function (target, propertyKey, descriptor) {
    // 保存原始方法
    const originalMethod = descriptor.value;
    // 重写方法
    descriptor.value = async function (...args) {
      const ctx = args[0]; // koa的context对象总是第一个参数
      const { permissions } = ctx.state.user;
      if (!permissions) {
        throw new AppError(ErrorCode.PERMISSION_DENIED, "该用户权限为空");
      }
      // 如果权限是 *:*:* 则直接放行
      if (permissions.includes("*:*:*")) {
        return originalMethod.apply(this, args);
      }
      // 如果有权限 则直接放行
      if (permissions.includes(per)) {
        return originalMethod.apply(this, args);
      }
      // 如果没有权限 则抛出错误
      throw new AppError(ErrorCode.PERMISSION_DENIED, "当前登录用户无权限");
    };

    return descriptor;
  };
}

module.exports = HasPermissions;
