const { SysOperLog } = require("@/core/database/models");
const { getGeoLocationByIp } = require("@/utils/tool");
/**
 * 操作日志装饰器
 * @param {String} title 模块标题
 * @param {String} businessType 业务类型（0=其它,1=新增,2=修改,3=删除,4=授权,5=导出,6=导入,7=强退,8=生成代码,9=清空数据）
 * @returns {Function} 装饰器函数
 */
function Log(title, businessType = 0) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const ctx = args[0]; // koa的上下文对象
      const startTime = new Date();

      try {
        // 执行原始方法
        await originalMethod.apply(this, args);
        const { code, msg } = ctx.body; // 在方法执行完后获取 ctx.body
        const response = { code, msg };
        // 记录操作日志
        const operLog = {
          title, // 模块标题
          businessType, // 业务类型
          method: ctx.method, // 请求方法
          requestMethod: ctx.request.method, // 请求方式
          operatorType: 1, // 操作类别（0其它 1后台用户 2手机端用户）
          operName: ctx.state.user ? ctx.state.user.userName : "", // 操作人员
          deptName: ctx.state.user ? ctx.state.user.dept.deptName : "", // 部门名称
          operUrl: ctx.url, // 请求URL
          operIp: ctx.ip, // 主机地址
          operLocation: getGeoLocationByIp(ctx.ip), // 操作地点
          operParam: JSON.stringify(ctx.request.body), // 请求参数
          jsonResult: JSON.stringify(response), // 返回参数
          status: 0, // 操作状态（0正常 1异常）
          errorMsg: "", // 错误消息
          operTime: startTime, // 操作时间
          costTime: new Date() - startTime, // 消耗时间
        };

        // 异步保存日志
        SysOperLog.create(operLog).catch(err => {
          console.error("记录操作日志失败:", err);
        });

        return ctx.body; // 返回响应结果
      } catch (error) {
        // 记录错误日志
        const operLog = {
          title,
          businessType,
          method: ctx.method,
          requestMethod: ctx.request.method,
          operatorType: 1,
          operName: ctx.state.user ? ctx.state.user.userName : "",
          deptName: ctx.state.user ? ctx.state.user.dept.deptName : "",
          operUrl: ctx.url,
          operIp: ctx.ip,
          operLocation: getGeoLocationByIp(ctx.ip),
          operParam: JSON.stringify(ctx.request.body),
          jsonResult: JSON.stringify(error.message),
          status: 1, // 异常状态
          errorMsg: error.message,
          operTime: startTime,
          costTime: new Date() - startTime,
        };

        SysOperLog.create(operLog).catch(err => {
          console.error("记录操作日志失败:", err);
        });

        throw error;
      }
    };
    return descriptor;
  };
}

module.exports = Log;
