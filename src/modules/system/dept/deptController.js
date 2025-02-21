const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const deptService = require("./deptService");

class DeptController {
  /**
   * 获取部门列表
   * @param {*} ctx
   */
  @HasPermissions("system:dept:list")
  async getDeptList(ctx) {
    const params = ctx.query;
    const data = await deptService.getDeptList(params);
    ctx.body = ResponceBody.successBody({ data }, "获取部门列表成功");
  }

  /**
   * 获取部门列表（排除节点）
   * @param {*} ctx
   */
  async getDeptListExclude(ctx) {
    const { params } = ctx;
    const data = await deptService.getDeptListExclude(params);
    ctx.body = ResponceBody.successBody({ data }, "获取部门列表成功");
  }

  /**
   * 获取部门信息
   * @param {*} ctx
   */
  @HasPermissions("system:dept:query")
  async getInfo(ctx) {
    const { params } = ctx;
    const data = await deptService.getInfo(params);
    ctx.body = ResponceBody.successBody({ data }, "获取部门信息成功");
  }

  /**
   * 修改部门
   * @param {*} ctx
   */
  @HasPermissions("system:dept:edit")
  @Log("修改部门", 2)
  async editDept(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    const data = await deptService.editDept(params);
    ctx.body = ResponceBody.successBody({}, "修改部门成功");
  }

  /**
   * 新增部门
   * @param {*} ctx
   */
  @HasPermissions("system:dept:add")
  @Log("新增部门", 1)
  async addDept(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    const data = await deptService.addDept(params);
    ctx.body = ResponceBody.successBody({}, "新增部门成功");
  }

  /**
   * 删除部门
   * @param {*} ctx
   */
  @HasPermissions("system:dept:remove")
  @Log("删除部门", 3)
  async deleteDept(ctx) {
    const { params } = ctx;
    const data = await deptService.deleteDept(params);
    ctx.body = ResponceBody.successBody({}, "删除部门成功");
  }
}

module.exports = new DeptController();
