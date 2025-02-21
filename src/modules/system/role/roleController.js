const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const roleService = require("./roleService");

class RoleController {
  /**
   * 获取角色列表
   * @param {*} ctx
   */
  @HasPermissions("system:role:list")
  async getRoleList(ctx) {
    const params = ctx.query;
    const [rows, total] = await roleService.getRoleList(params);
    ctx.body = ResponceBody.successBody({ rows, total }, "获取角色列表成功");
  }

  /**
   * 新增角色
   * @param {*} ctx
   */
  @HasPermissions("system:role:add")
  @Log("新增角色", 1)
  async addRole(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    await roleService.addRole(params);
    ctx.body = ResponceBody.successBody({}, "新增角色成功");
  }

  /**
   * 修改角色
   * @param {*} ctx
   */
  @HasPermissions("system:role:edit")
  @Log("修改角色", 2)
  async updateRole(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await roleService.updateRole(params);
    ctx.body = ResponceBody.successBody({}, "修改角色成功");
  }

  /**
   * 删除角色
   * @param {*} ctx
   */
  @HasPermissions("system:role:remove")
  @Log("删除角色", 3)
  async deleteRole(ctx) {
    const params = ctx.request.body;
    await roleService.deleteRole(params);
    ctx.body = ResponceBody.successBody({}, "删除角色成功");
  }

  /**
   * 获取角色信息
   * @param {*} ctx
   */
  @HasPermissions("system:role:query")
  async getRoleInfo(ctx) {
    const { params } = ctx.request;
    const res = await roleService.getRoleInfo(params);
    ctx.body = ResponceBody.successBody({ data: res }, "获取角色信息成功");
  }

  /**
   * 获取已分配用户列表
   * @param {*} ctx
   */
  @HasPermissions("system:role:query")
  async getAllocatedList(ctx) {
    const params = ctx.query;
    const [rows, total] = await roleService.getAllocatedList({
      roleId: params.roleId,
      ...params,
    });
    ctx.body = ResponceBody.successBody({ rows, total }, "获取已分配用户列表成功");
  }

  /**
   * 取消授权用户
   * @param {*} ctx
   */
  @Log("取消授权用户", 4)
  async cancelAuthUser(ctx) {
    const params = ctx.request.body;
    await roleService.cancelAuthUser(params);
    ctx.body = ResponceBody.successBody({}, "取消授权用户成功");
  }

  /**
   * 批量取消授权用户
   * @param {*} ctx
   */
  @Log("批量取消授权用户", 4)
  async cancelAuthUserAll(ctx) {
    const params = ctx.query;
    await roleService.cancelAuthUserAll(params);
    ctx.body = ResponceBody.successBody({}, "批量取消授权用户成功");
  }

  /**
   * 获取未分配用户列表
   * @param {*} ctx
   */
  @HasPermissions("system:role:query")
  async getUnAllocatedList(ctx) {
    const params = ctx.query;
    const [rows, total] = await roleService.getUnAllocatedList(params);
    ctx.body = ResponceBody.successBody({ rows, total }, "获取未分配用户列表成功");
  }

  /**
   * 批量选择用户授权
   * @param {*} ctx
   */
  @Log("批量选择用户授权", 4)
  async selectAuthUserAll(ctx) {
    const params = ctx.query;
    await roleService.selectAuthUserAll(params);
    ctx.body = ResponceBody.successBody({}, "批量选择用户授权成功");
  }

  async getDeptTree(ctx) {
    const { params } = ctx.request;
    const [tree, checkedKeysArr] = await roleService.getDeptTree(params);
    ctx.body = ResponceBody.successBody(
      { depts: tree, checkedKeys: checkedKeysArr },
      "获取用户部门树成功",
    );
  }

  /**
   * 分配角色数据权限
   * @param {*} ctx
   */
  @HasPermissions("system:role:dataScope")
  @Log("分配角色数据权限", 2)
  async assignDataScope(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await roleService.assignDataScope(params);
    ctx.body = ResponceBody.successBody({}, "分配角色数据权限成功");
  }
}

module.exports = new RoleController();
