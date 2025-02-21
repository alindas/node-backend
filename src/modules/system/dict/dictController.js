const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const service = require("./dictService");

class DictController {
  /**
   * 获取字典类型列表
   * @param {*} ctx
   */
  @HasPermissions("system:dict:list")
  async getDictTypeList(ctx) {
    const params = ctx.request.query;
    const [dictTypeList, total] = await service.getDictTypeList(params);
    ctx.body = ResponceBody.listBody(
      {
        rows: dictTypeList,
        total,
      },
      "获取字典类型成功",
    );
  }

  /**
   * 获取字典类型下拉框
   * @param {*} ctx
   */
  async getDictTypeOptionSelect(ctx) {
    const dictTypeOptionSelect = await service.getDictTypeOptionSelect();
    ctx.body = ResponceBody.successBody({ data: dictTypeOptionSelect }, "获取字典类型下拉框成功");
  }

  /**
   * 获取字典数据
   * @param {*} ctx
   */
  @HasPermissions("system:dict:query")
  async getDictType(ctx) {
    const { params } = ctx;
    const dictInfo = await service.getDictInfo(params);
    ctx.body = ResponceBody.successBody({ data: dictInfo }, "获取字典类型成功");
  }

  /**
   * 新增字典类型
   * @param {*} ctx
   */
  @HasPermissions("system:dict:add")
  @Log("新增字典类型", 1)
  async addDictType(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    await service.addDictType(params);
    ctx.body = ResponceBody.successBody({}, "新增字典类型成功");
  }

  /**
   * 修改字典类型
   * @param {*} ctx
   */
  @HasPermissions("system:dict:edit")
  @Log("修改字典类型", 2)
  async updateDictType(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await service.updateDictType(params);
    ctx.body = ResponceBody.successBody({}, "更新字典类型成功");
  }

  /**
   * 删除字典类型
   * @param {*} ctx
   */
  @HasPermissions("system:dict:remove")
  @Log("删除字典类型", 3)
  async deleteDictType(ctx) {
    const { params } = ctx;
    await service.deleteDictType(params);
    ctx.body = ResponceBody.successBody({}, "删除字典类型成功");
  }

  /**
   * 获取字典数据
   * @param {*} ctx
   */
  @HasPermissions("system:dict:data")
  async getDictDataList(ctx) {
    const params = ctx.request.query;
    const dictDataList = await service.getDictDataList(params);
    ctx.body = ResponceBody.successBody({ data: dictDataList }, "获取字典子项成功");
  }

  /**
   * 获取字典数据值
   * @param {*} ctx
   */
  async getDictDataValue(ctx) {
    const { params } = ctx;
    const dictDataValue = await service.getDictDataValue(params);
    ctx.body = ResponceBody.successBody({ data: dictDataValue }, "获取字典子项成功");
  }

  /**
   * 获取字典数据
   * @param {*} ctx
   */
  async getDictData(ctx) {
    const { params } = ctx;
    const dictData = await service.getDictData(params);
    ctx.body = ResponceBody.successBody({ data: dictData }, "获取字典子项成功");
  }

  /**
   * 新增字典子项
   * @param {*} ctx
   */
  @Log("新增字典子项", 1)
  async addDictData(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    await service.addDictData(params);
    ctx.body = ResponceBody.successBody({}, "新增字典子项成功");
  }

  /**
   * 修改字典子项
   * @param {*} ctx
   */
  @Log("修改字典子项", 2)
  async updateDictData(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    await service.updateDictData(params);
    ctx.body = ResponceBody.successBody({}, "更新字典子项成功");
  }

  /**
   * 删除字典子项
   * @param {*} ctx
   */
  @Log("删除字典子项", 3)
  async deleteDictData(ctx) {
    const { params } = ctx;
    await service.deleteDictData(params);
    ctx.body = ResponceBody.successBody({}, "删除字典子项成功");
  }
}
module.exports = new DictController();
