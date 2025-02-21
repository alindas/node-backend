const Router = require("koa-router");
const controller = require("./dictController");

const router = new Router({
  prefix: "/system/dict",
});
// 获取字典类型
router.get("/type/list", controller.getDictTypeList);
router.get("/type/optionselect", controller.getDictTypeOptionSelect);
router.get("/type/:id", controller.getDictType);
// 编辑字典类型
router.put("/type", controller.updateDictType);
// 新增字典类型
router.post("/type", controller.addDictType);
// 刷新字典类型
router.delete("/type/refreshCache", () => {});
// 删除字典类型
router.delete("/type/:ids", controller.deleteDictType);

// 获取字典
router.get("/data/list", controller.getDictDataList);
// 获取只当key的字典值
router.get("/data/:dictCode", controller.getDictData);

router.get("/data/type/:dictType", controller.getDictDataValue);
// 新增字典值
router.post("/data", controller.addDictData);
// 编辑字典值
router.put("/data", controller.updateDictData);
// 删除字典值
router.delete("/data/:dictCodes", controller.deleteDictData);
module.exports = router;
