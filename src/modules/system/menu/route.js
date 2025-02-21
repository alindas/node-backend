const Router = require("koa-router");

const router = new Router({
  prefix: "/system/menu",
});

const controller = require("./menuController");
// 获取菜单列表
router.get("/list", controller.getMenuList);
// 获取菜单下拉树结构
router.get("/treeselect", controller.getMenuTreeSelect);
// 根据角色ID查询菜单下拉树结构
router.get("/roleMenuTreeselect/:roleId", controller.getMenuTreeSelectByRoleId);
// 新增菜单
router.post("/", controller.addMenu);
// 修改菜单
router.put("/", controller.editMenu);
// 根据菜单编号获取详细信息
router.get("/:menuId", controller.getInfo);
// 删除菜单
router.delete("/:menuId", controller.deleteMenu);

module.exports = router;
