const Router = require("koa-router");
const roleController = require("./roleController");

const router = new Router({
  prefix: "/system/role",
});

router.get("/list", roleController.getRoleList);
// 新增角色信息
router.post("/", roleController.addRole);
// 修改角色信息
router.put("/", roleController.updateRole);
// 删除角色信息
router.delete("/", roleController.deleteRole);
// 获取已分配用户列表
router.get("/authUser/allocatedList", roleController.getAllocatedList);
// 查询未分配权限用户
router.get("/authUser/unallocatedList", roleController.getUnAllocatedList);
// 取消授权用户
router.put("/authUser/cancel", roleController.cancelAuthUser);
// 批量取消授权用户
router.put("/authUser/cancelAll", roleController.cancelAuthUserAll);
// 批量授权
router.put("/authUser/selectAll", roleController.selectAuthUserAll);
// 获取用户部门树
router.get("/deptTree/:roleId", roleController.getDeptTree);
// 分配角色数据权限
router.put("/dataScope", roleController.assignDataScope);
// 获取角色信息
router.get("/:roleId", roleController.getRoleInfo);
module.exports = router;
