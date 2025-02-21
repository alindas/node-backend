const { Op } = require("sequelize");
const { SysPost } = require("@/core/database/models");

class PostService {
  async getPostList(params) {
    const { postName, status, pageNum = 1, pageSize = 10 } = params;
    const where = {};
    if (postName) {
      where.postName = { [Op.like]: `%${postName}%` };
    }
    if (status) {
      where.status = status;
    }
    const offset = (pageNum - 1) * pageSize;
    const limit = Number(pageSize);
    const res = await SysPost.findAndCountAll({ where, offset, limit });
    return [res.rows, res.count];
  }

  async getPostInfo(params) {
    const { postId } = params;
    const res = await SysPost.findOne({ where: { postId } });
    return res;
  }

  async editPost(params) {
    const { postId, ...rest } = params;
    await SysPost.update({ ...rest }, { where: { postId } });
  }

  async addPost(params) {
    await SysPost.create(params);
  }

  async deletePost(params) {
    const { postIds } = params;
    await SysPost.destroy({
      where: { postId: { [Op.in]: postIds.split(",") } },
    });
  }
}

module.exports = new PostService();
