const Router = require("koa-router");

const router = new Router({
  prefix: "/system/post",
});
const controller = require("./postController");
// 获取岗位列表
router.get("/list", controller.getPostList);
// 根据岗位编号获取详细信息
router.get("/:postId", controller.getPostInfo);
// 编辑
router.put("/", controller.editPost);
// 新增
router.post("/", controller.addPost);
// 删除
router.delete("/:postIds", controller.deletePost);
module.exports = router;
