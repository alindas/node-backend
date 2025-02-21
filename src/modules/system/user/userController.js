const { Log, HasPermissions } = require("@/decorator");
const redis = require("@/core/redis");
const SYSTEM = require("@/constants/cache");
const Tools = require("@/utils/tool");
const ResponceBody = require("@/utils/responceBody");
const service = require("./userService");

class UserController {
  // 获取用户列表
  @HasPermissions("system:user:list")
  async getUserList(ctx) {
    const params = ctx.query;
    ctx.condition = Tools.getUserCondition(ctx);
    const [rows, total] = await service.getUserList(params, ctx);
    ctx.body = ResponceBody.successBody({ rows, total }, "获取用户列表成功");
  }

  /**
   * 获取用户信息
   * @param {*} ctx
   */
  @HasPermissions("system:user:query")
  async getUserInfo(ctx) {
    const { params } = ctx;
    const { user, posts, roles, postIds, roleIds } = await service.getUserInfo(params);
    ctx.body = ResponceBody.successBody(
      { data: user, posts, roles, postIds, roleIds },
      "获取用户信息成功",
    );
  }

  /**
   * 删除用户
   * @param {*} ctx
   */
  @HasPermissions("system:user:remove")
  @Log("删除用户", 3)
  async deleteUser(ctx) {
    const { params } = ctx;
    await service.deleteUser(params);
    ctx.body = ResponceBody.successBody({}, "删除用户成功");
  }

  /**
   * 修改用户
   * @param {*} ctx
   */
  @HasPermissions("system:user:edit")
  @Log("修改用户", 2)
  async updateUser(ctx) {
    const params = ctx.request.body;
    await service.updateUserInfo(params);
    ctx.body = ResponceBody.successBody({}, "更新用户成功");
  }

  /**
   * 获取部门��
   * @param {*} ctx
   */
  async getDeptTree(ctx) {
    const data = await service.getDeptTree();
    ctx.body = ResponceBody.successBody({ data }, "获取部门树成功");
  }

  /**
   * 新增用户
   * @param {*} ctx
   */
  @HasPermissions("system:user:add")
  @Log("新增用户", 1)
  async addUser(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    params.updateBy = ctx.state.user.userName;
    await service.addUser(params);
    ctx.body = ResponceBody.successBody({}, "新增用户成功");
  }

  /**
   * 重置密码
   * @param {*} ctx
   */
  @HasPermissions("system:user:resetPwd")
  @Log("重置密码", 2)
  async resetPwd(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    const pwd = await service.resetPwd(params);
    ctx.body = ResponceBody.successBody({}, `重置密码成功，新密码为：${pwd}`);
  }

  /**
   * 修改用户状态
   * @param {*} ctx
   */
  @Log("修改用户状态", 2)
  async changeStatus(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await service.changeStatus(params);
    ctx.body = ResponceBody.successBody({}, "修改状态成功");
  }

  /**
   * 获取授权角色
   * @param {*} ctx
   */
  async AuthRole(ctx) {
    const { params } = ctx;
    const [roles, user] = await service.getAuthRole(params);
    ctx.body = ResponceBody.successBody({ roles, user }, "获取授权角色成功");
  }

  /**
   * 编辑授权角色
   * @param {*} ctx
   */
  @HasPermissions("system:user:authRole")
  @Log("授权角色", 4)
  async EditAuthRole(ctx) {
    const params = ctx.query;
    await service.editAuthRole(params);
    ctx.body = ResponceBody.successBody({}, "编辑授权角色成功");
  }

  /**
   * 获取个人信息
   * @param {*} ctx
   */
  async getProfile(ctx) {
    const { user, roleGroup, postGroup } = await service.getProfile(ctx.state.user);
    ctx.body = ResponceBody.successBody({ data: user, roleGroup, postGroup }, "获取个人信息成功");
  }

  /**
   * 修改个人信息
   * @param {*} ctx
   */
  @Log("修改个人信息", 2)
  async profileEdit(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await service.profileEdit(params);
    ctx.body = ResponceBody.successBody({}, "修改个人信息成功");
  }

  /**
   * 修改密码
   * @param {*} ctx
   */
  @HasPermissions("system:user:changePwd")
  @Log("修改密码", 2)
  async changePwd(ctx) {
    const params = ctx.query;
    params.updateBy = ctx.state.user.userName;
    await service.changePwd({ ...params, userId: ctx.state.user.userId });
    // 修改密码后，清除redis中的用户信息
    await redis.del(`${SYSTEM.USER_KEY}${ctx.state.user.userName}`);
    await redis.del(`${SYSTEM.TOKEN_KEY}${ctx.state.user.uuid}`);
    ctx.body = ResponceBody.successBody({}, "修改密码成功");
  }
}
module.exports = new UserController();
