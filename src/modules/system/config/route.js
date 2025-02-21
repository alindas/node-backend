const Router = require("koa-router");

const router = new Router({
  prefix: "/system/config",
});
const controller = require("./configController");

router.get("/list", controller.getConfigList);
// 根据参数编号获取详细信息
router.get("/:configId", controller.getConfigInfo);
// 新增参数配置
router.post("/", controller.addConfig);
// // 修改参数配置
router.put("/", controller.editConfig);
// // 刷新参数缓存
// router.delete('/refreshCache', controller.refreshCache)

// 删除参数配置
router.delete("/:configIds", controller.deleteConfig);

// // 根据参数键名查询参数值
// router.get('/configKey/:configKey', controller.getConfigKey)
module.exports = router;
