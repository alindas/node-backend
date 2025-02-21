const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const configService = require("./configService");

class ConfigController {
  /**
   * 获取参数配置列表
   * @param {*} ctx
   */
  @HasPermissions("system:config:list")
  async getConfigList(ctx) {
    const params = ctx.query;
    const [list, total] = await configService.getConfigList(params);
    ctx.body = ResponceBody.listBody({
      rows: list,
      total,
    });
  }

  /**
   * 获取参数配置信息
   * @param {*} ctx
   */
  @HasPermissions("system:config:query")
  async getConfigInfo(ctx) {
    const { params } = ctx;
    const res = await configService.getConfigInfo(params);
    ctx.body = ResponceBody.successBody({ data: res }, "获取参数配置信息成功");
  }

  /**
   * 新增参数配置
   * @param {*} ctx
   */
  @HasPermissions("system:config:add")
  @Log("新增参数配置", 1)
  async addConfig(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    await configService.addConfig(params);
    ctx.body = ResponceBody.successBody({}, "新增参数配置成功");
  }

  /**
   * 修改参数配置
   * @param {*} ctx
   */
  @HasPermissions("system:config:edit")
  @Log("修改参数配置", 2)
  async editConfig(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await configService.editConfig(params);
    ctx.body = ResponceBody.successBody({}, "修改参数配置成功");
  }

  /**
   * 删除参数配置
   * @param {*} ctx
   */
  @HasPermissions("system:config:remove")
  @Log("删除参数配置", 3)
  async deleteConfig(ctx) {
    const { params } = ctx;
    await configService.deleteConfig(params);
    ctx.body = ResponceBody.successBody({}, "删除参数配置成功");
  }
}

module.exports = new ConfigController();
