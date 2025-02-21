const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const service = require("./menuService");

class MenuController {
  /**
   * 获取菜单列表
   * @param {*} ctx
   */
  @HasPermissions("system:menu:list")
  async getMenuList(ctx) {
    const params = ctx.query;
    const res = await service.getMenuList(params);
    ctx.body = ResponceBody.successBody({ data: res }, "获取菜单列表成功");
  }

  /**
   * 获取菜单信息
   * @param {*} ctx
   */
  @HasPermissions("system:menu:query")
  async getInfo(ctx) {
    const { params } = ctx.request;
    const res = await service.getInfo(params);
    ctx.body = ResponceBody.successBody({ data: res }, "获取菜单信息成功");
  }

  /**
   * 新增菜单
   * @param {*} ctx
   */
  @HasPermissions("system:menu:add")
  @Log("新增菜单", 1)
  async addMenu(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    const res = await service.addMenu(params);
    ctx.body = ResponceBody.successBody({}, "添加菜单成功");
  }

  /**
   * 修改菜单
   * @param {*} ctx
   */
  @HasPermissions("system:menu:edit")
  @Log("修改菜单", 2)
  async editMenu(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    const res = await service.editMenu(params);
    ctx.body = ResponceBody.successBody({}, "编辑菜单成功");
  }

  /**
   * 删除菜单
   * @param {*} ctx
   */
  @HasPermissions("system:menu:remove")
  @Log("删除菜单", 3)
  async deleteMenu(ctx) {
    const { params } = ctx.request;
    const res = await service.deleteMenu(params);
    ctx.body = ResponceBody.successBody({}, "删除菜单成功");
  }

  /**
   * 获取菜单树形结构
   * @param {*} ctx
   */
  async getMenuTreeSelect(ctx) {
    const { userId } = ctx.state.user;
    const res = await service.getMenuTreeSelect({ userId });
    ctx.body = ResponceBody.successBody({ data: res }, "获取菜单树形结构成功");
  }

  /**
   * 获取菜单树形结构（根据角色ID）
   * @param {*} ctx
   */
  async getMenuTreeSelectByRoleId(ctx) {
    const { params } = ctx.request;
    params.userId = ctx.state.user.userId;
    const [tree, res] = await service.getMenuTreeSelectByRoleId(params);
    ctx.body = {
      menus: tree,
      checkedKeys: res.map(item => item.menuId),
    };
  }
}

module.exports = new MenuController();
