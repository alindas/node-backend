const { Log, HasPermissions } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const postService = require("./postService");

class PostController {
  /**
   * 获取岗位列表
   * @param {*} ctx
   */
  @HasPermissions("system:post:list")
  async getPostList(ctx) {
    const params = ctx.query;
    const [rows, total] = await postService.getPostList(params);
    ctx.body = ResponceBody.successBody({ rows, total }, "获取岗位列表成功");
  }

  /**
   * 获取岗位信息
   * @param {*} ctx
   */
  @HasPermissions("system:post:query")
  async getPostInfo(ctx) {
    const { params } = ctx;
    const result = await postService.getPostInfo(params);
    ctx.body = ResponceBody.successBody({ data: result }, "获取岗位信息成功");
  }

  /**
   * 修改岗位
   * @param {*} ctx
   */
  @HasPermissions("system:post:edit")
  @Log("修改岗位", 2)
  async editPost(ctx) {
    const params = ctx.request.body;
    params.updateBy = ctx.state.user.userName;
    const result = await postService.editPost(params);
    ctx.body = ResponceBody.successBody({}, "修改岗位成功");
  }

  /**
   * 新增岗位
   * @param {*} ctx
   */
  @HasPermissions("system:post:add")
  @Log("新增岗位", 1)
  async addPost(ctx) {
    const params = ctx.request.body;
    params.createBy = ctx.state.user.userName;
    const result = await postService.addPost(params);
    ctx.body = ResponceBody.successBody({}, "新增岗位成功");
  }

  /**
   * 删除岗位
   * @param {*} ctx
   */
  @HasPermissions("system:post:remove")
  @Log("删除岗位", 3)
  async deletePost(ctx) {
    const { params } = ctx;
    const result = await postService.deletePost(params);
    ctx.body = ResponceBody.successBody({}, "删除岗位成功");
  }
}

module.exports = new PostController();
