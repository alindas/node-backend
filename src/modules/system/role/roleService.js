const { Op } = require("sequelize");
const { ErrorCode } = require("@/constants/stateCode");
const {
  SysUser,
  SysRole,
  SysUserRole,
  SysRoleMenu,
  SysDept,
  SysRoleDept,
} = require("@/core/database/models");
const AppError = require("@/utils/AppError");
const { buildTree } = require("@/utils/tool");

class RoleService {
  async getRoleList(params) {
    const { roleName, status, roleKey, pageNum = 1, pageSize = 10 } = params;
    const offset = (pageNum - 1) * pageSize;
    const limit = Number(pageSize);
    const where = {};
    if (roleName) where.roleName = { [Op.like]: `%${roleName}%` };
    if (status) where.status = status;
    if (roleKey) where.roleKey = { [Op.like]: `%${roleKey}%` };
    const res = await SysRole.findAndCountAll({
      where,
      offset,
      limit,
    });
    return [res.rows, res.count];
  }

  async addRole(params) {
    await SysRole.create(params);
  }

  async updateRole(params) {
    const { roleId, ...rest } = params;
    await SysRole.update({ ...rest }, { where: { roleId } });
    const { menuIds } = params;
    await SysRoleMenu.destroy({ where: { roleId } });
    await SysRoleMenu.bulkCreate(menuIds.map(menuId => ({ roleId, menuId })));
  }

  async deleteRole(params) {
    const { roleId } = params;
    if (!roleId) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysRole.destroy({ where: { roleId } });
  }

  async getRoleInfo(params) {
    const { roleId } = params;
    if (!roleId) throw new AppError(ErrorCode.PARAM_MISSING);
    const res = await SysRole.findOne({ where: { roleId } });
    return res;
  }

  async getAllocatedList(params) {
    const { roleId, userName, phonenumber, pageNum = 1, pageSize = 10 } = params;
    if (!roleId) throw new AppError(ErrorCode.PARAM_MISSING);
    const offset = (pageNum - 1) * pageSize;
    const limit = Number(pageSize);
    const where = {};
    if (userName) where.userName = { [Op.like]: `%${userName}%` };
    if (phonenumber) where.phonenumber = { [Op.like]: `%${phonenumber}%` };
    const { rows, total } = await SysUser.findAndCountAll({
      include: [{ model: SysRole, where: { roleId } }],
      offset,
      limit,
    });
    return [rows, total];
  }

  async cancelAuthUser(params) {
    const { roleId, userId } = params;
    if (!roleId || !userId) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysUserRole.destroy({ where: { roleId, userId } });
  }

  async cancelAuthUserAll(params) {
    const { roleId, userIds } = params;
    if (!roleId || !userIds) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysUserRole.destroy({
      where: { roleId, userId: { [Op.in]: userIds.split(",") } },
    });
  }

  async getUnAllocatedList(params) {
    const { roleId, userName, phonenumber, pageNum = 1, pageSize = 10 } = params;
    if (!roleId) throw new AppError(ErrorCode.PARAM_MISSING);
    const offset = (pageNum - 1) * pageSize;
    const limit = Number(pageSize);
    const where = {};
    if (userName) where.userName = { [Op.like]: `%${userName}%` };
    if (phonenumber) where.phonenumber = { [Op.like]: `%${phonenumber}%` };
    const userIds = await SysUserRole.findAll({ where: { roleId } });
    const userIdsArr = userIds.map(item => item.userId);
    // 排除超级管理员
    userIdsArr.push(1);
    const res = await SysUser.findAndCountAll({
      where: {
        ...where,
        userId: { [Op.notIn]: userIdsArr },
      },
      offset,
      limit,
    });
    return [res.rows, res.count];
  }

  async selectAuthUserAll(params) {
    const { roleId, userIds } = params;
    if (!roleId || !userIds) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysUserRole.bulkCreate(userIds.split(",").map(userId => ({ roleId, userId })));
  }

  async getDeptTree(params) {
    const { roleId } = params;
    if (!roleId) throw new AppError(ErrorCode.PARAM_MISSING);
    const res = await SysDept.findAll({
      // include: [{ model: SysRoleDept }],
    });
    const checkedKeys = await SysRoleDept.findAll({
      attributes: ["deptId"],
      where: { roleId },
    });
    const checkedKeysArr = checkedKeys.map(item => item.deptId);

    const tree = buildTree({
      items: res,
      idKey: "deptId",
      parentKey: "parentId",
      childrenKey: "children",
      labelKey: "deptName",
    });
    return [tree, checkedKeysArr];
  }

  async assignDataScope(params) {
    const { roleId, dataScope, deptIds } = params;
    if (!roleId || !dataScope || !deptIds) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysRole.update({ dataScope }, { where: { roleId } });
    await SysRoleDept.destroy({ where: { roleId } });
    await SysRoleDept.bulkCreate(deptIds.map(deptId => ({ roleId, deptId })));
  }
}

module.exports = new RoleService();
