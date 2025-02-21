const Router = require("koa-router");

const router = new Router({
  prefix: "/system/dept",
});
const controller = require("./deptController");
// 获取部门列表
router.get("/list", controller.getDeptList);
// 获取部门列表（排除节点）
router.get("/list/exclude/:deptId", controller.getDeptListExclude);
// 根据部门编号获取详细信息
router.get("/:deptId", controller.getInfo);
// 新增部门
router.post("/", controller.addDept);
// 修改部门
router.put("/", controller.editDept);
// 删除部门
router.delete("/:ids", controller.deleteDept);
module.exports = router;
