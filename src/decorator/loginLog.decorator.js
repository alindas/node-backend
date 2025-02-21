const { SysLogininfor } = require("@/core/database/models");
const { getGeoLocationByIp } = require("@/utils/tool");
/**
 * 登录日志装饰器
 * @param {String} status 登录状态（0成功 1失败）
 * @param {String} msg 提示信息
 * @returns {Function} 装饰器函数
 */
function LoginLog(status = "0", msg = "登录成功") {
  return function (target, propertyKey, descriptor) {
    // 保存原始方法
    const originalMethod = descriptor.value;

    // 重写方法
    descriptor.value = async function (...args) {
      const ctx = args[0]; // koa的上下文对象
      const startTime = new Date();

      try {
        // 执行原始方法
        await originalMethod.apply(this, args);

        // 记录登录日志
        const loginLog = {
          userName: ctx.request?.body?.username || ctx.state.user?.userName || "", // 用户名称
          status, // 登录状态
          ipaddr: ctx.ip, // 登录IP地址
          loginLocation: getGeoLocationByIp(ctx.ip), // 登录地点
          browser: ctx.userAgent.browser || "", // 浏览器类型
          os: ctx.userAgent.os || "", // 操作系统
          msg, // 提示消息
          loginTime: startTime, // 登录时间
        };

        // 异步保存日志
        SysLogininfor.create(loginLog).catch(err => {
          console.error("记录登录日志失败:", err);
        });

        return ctx.body;
      } catch (error) {
        // 记录失败日志
        const loginLog = {
          userName: ctx.request?.body?.userName || ctx?.state?.user?.userName || "",
          status: "1", // 失败状态
          ipaddr: ctx.ip,
          loginLocation: getGeoLocationByIp(ctx.ip),
          browser: ctx.userAgent.browser || "",
          os: ctx.userAgent.os || "",
          msg: error.message || "登录失败",
          loginTime: startTime,
        };

        // 异步保存日志
        SysLogininfor.create(loginLog).catch(err => {
          console.error("记录登录日志失败:", err);
        });

        throw error; // 继续抛出错误
      }
    };

    return descriptor;
  };
}

module.exports = LoginLog;
