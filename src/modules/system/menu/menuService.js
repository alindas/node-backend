const { Op } = require("sequelize");
const { SysMenu, SysRole, SysUser, SysRoleMenu } = require("@/core/database/models");
const { buildTree } = require("@/utils/tool");

class MenuService {
  async getMenuList(params) {
    const { menuName, status } = params;
    const where = {};
    if (menuName) {
      where.menuName = { [Op.like]: `%${menuName}%` };
    }
    if (status !== undefined) {
      where.status = status;
    }
    const res = await SysMenu.findAll({ where, order: [["orderNum", "asc"]] });
    return res;
  }

  async getInfo(params) {
    const { menuId } = params;
    const res = await SysMenu.findOne({ where: { menuId } });
    return res;
  }

  async addMenu(params) {
    await SysMenu.create(params);
  }

  async editMenu(params) {
    await SysMenu.update(params, { where: { menuId: params.menuId } });
  }

  async deleteMenu(params) {
    const { menuId } = params;
    await SysMenu.destroy({ where: { menuId } });
  }

  async getMenuTreeSelect(params) {
    const { userId } = params;
    const res = await SysMenu.findAll({
      include: [
        {
          model: SysRole,
          attributes: [],
          include: [
            {
              model: SysUser,
              attributes: [],
              where: { userId },
            },
          ],
        },
      ],
      where: { status: "0" },
      order: [["orderNum", "asc"]],
    });
    const tree = buildTree({
      items: res,
      idKey: "menuId",
      parentKey: "parentId",
      childrenKey: "children",
      labelKey: "menuName",
    });
    const buildLabel = data => {
      const arr = [];
      data.forEach(item => {
        if (item.children && item.children.length > 0) {
          arr.push({
            label: item.menuName,
            id: item.menuId,
            children: buildLabel(item.children),
          });
        } else {
          arr.push({
            label: item.menuName,
            id: item.menuId,
          });
        }
      });
      return arr;
    };
    return buildLabel(tree);
  }

  async getMenuTreeSelectByRoleId(params) {
    const { roleId, userId } = params;
    const tree = await this.getMenuTreeSelect({ userId });
    const res = await SysRoleMenu.findAll({ where: { roleId } });
    return [tree, res];
  }
}

module.exports = new MenuService();
