const Router = require("koa-router");
const controller = require("./authController");

const router = new Router({
  prefix: "",
});

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/captcha", controller.captcha);
router.get("/getInfo", controller.userInfo);
// 获取路由
router.get("/getRouters", controller.getRouters);
// //公钥
router.get("/getPublicKey", controller.getPublicKey);
// router.post('/uploadImg', UPLOAD_IMG)
module.exports = router;
