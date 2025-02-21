const Router = require("koa-router");

const router = new Router({
  prefix: "/monitor",
});
const controller = require("./monitorController");
// 获取登录日志列表
router.get("/logininfor/list", controller.getLogininforList);
// 清空登录日志
router.delete("/logininfor/clean", controller.logininforClean);
// 删除登录日志
router.delete("/logininfor/:infoIds", controller.deleteLogininfor);
// 解锁用户登录日志
router.get("/logininfor/unlock/:username", controller.unlockLogininfor);
// 获取操作日志列表
router.get("/operlog/list", controller.getOperlogList);
// 清空操作日志
router.delete("/operlog/clean", controller.operlogClean);
// 删除操作日志
router.delete("/operlog/:operIds", controller.deleteOperlog);
module.exports = router;
