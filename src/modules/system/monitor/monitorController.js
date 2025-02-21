const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const MonitorService = require("./nonitorService");

class MonitorController {
  /**
   * 获取登录日志列表
   * @param {*} ctx
   */
  @HasPermissions("monitor:logininfor:query")
  async getLogininforList(ctx) {
    const [rows, total] = await MonitorService.getLogininforList(ctx.query);
    ctx.body = ResponceBody.successBody({ total, rows }, "查询成功");
  }

  /**
   * 删除登录日志
   * @param {*} ctx
   */
  @HasPermissions("monitor:logininfor:remove")
  @Log("删除登录日志", 3)
  async deleteLogininfor(ctx) {
    const { infoIds } = ctx.params;
    await MonitorService.deleteLogininfor(infoIds);
    ctx.body = ResponceBody.successBody({}, "删除成功");
  }

  /**
   * 清空登录日志
   * @param {*} ctx
   */
  @HasPermissions("monitor:logininfor:remove")
  @Log("清空登录日志", 3)
  async logininforClean(ctx) {
    await MonitorService.logininforClean();
    ctx.body = ResponceBody.successBody({}, "清空成功");
  }

  /**
   * 解锁用户
   * @param {*} ctx
   */
  @HasPermissions("monitor:logininfor:unlock")
  @Log("解锁用户", 3)
  async unlockLogininfor(ctx) {
    const { username } = ctx.params;
    await MonitorService.unlockLogininfor(username);
    ctx.body = ResponceBody.successBody({}, "解锁成功");
  }

  /**
   * 获取操作日志列表
   * @param {*} ctx
   */
  @HasPermissions("monitor:operlog:query")
  async getOperlogList(ctx) {
    const params = ctx.query;
    const [rows, total] = await MonitorService.getOperlogList(params);
    ctx.body = ResponceBody.successBody({ total, rows }, "查询成功");
  }

  /**
   * 清空操作日志
   * @param {*} ctx
   */
  @HasPermissions("monitor:operlog:remove")
  @Log("清空操作日志", 3)
  async operlogClean(ctx) {
    await MonitorService.operlogClean();
    ctx.body = ResponceBody.successBody({}, "清空成功");
  }

  /**
   * 删除操作日志
   * @param {*} ctx
   */
  @HasPermissions("monitor:operlog:remove")
  @Log("删除操作日志", 3)
  async deleteOperlog(ctx) {
    const { operIds } = ctx.params;
    await MonitorService.deleteOperlog(operIds);
    ctx.body = ResponceBody.successBody({}, "删除成功");
  }
}

module.exports = new MonitorController();
