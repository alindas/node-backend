const Router = require("koa-router");

const router = new Router({
  prefix: "/system/user",
});
const controller = require("./userController");
// 获取用户列表
router.get("/list", controller.getUserList);
// 获取用户信息
router.get("/", controller.getUserInfo);
// 获取部门树列表
router.get("/deptTree", controller.getDeptTree);
// 个人中心
router.get("/profile", controller.getProfile);
// 个人中心修改
router.put("/profile", controller.profileEdit);
// 修改密码
router.put("/profile/updatePwd", controller.changePwd);
// 获取用户信息
router.get("/:userId", controller.getUserInfo);
// 新增用户
router.post("/", controller.addUser);
// 删除用户
router.delete("/:userIds", controller.deleteUser);
// 更新用户
router.put("/", controller.updateUser);
// 重置密码
router.put("/resetPwd", controller.resetPwd);
// 根据用户编号获取授权角色
router.get("/authRole/:userId", controller.AuthRole);
// 用户授权角色
router.put("/authRole", controller.EditAuthRole);
// 状态修改
router.put("/changeStatus", controller.changeStatus);
// //导出用户
// router.post('/export', ExportUser)
module.exports = router;
