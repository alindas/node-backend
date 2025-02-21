const { Op } = require("sequelize");
const { ErrorCode } = require("@/constants/stateCode");
const { SysDept } = require("@/core/database/models");
const AppError = require("@/utils/AppError");

class DeptService {
  async getDeptList(params) {
    const { deptName, status } = params;
    const where = {};
    if (deptName) where.deptName = deptName;
    if (status) where.status = status;
    const res = await SysDept.findAll({ where, order: [["orderNum", "asc"]] });
    return res;
  }

  async getDeptListExclude(params) {
    const { deptId } = params;
    if (!deptId) throw new AppError(ErrorCode.PARAM_MISSING);
    const res = await SysDept.findAll({
      where: { deptId: { [Op.ne]: deptId } },
    });
    return res;
  }

  async getInfo(params) {
    const { deptId } = params;
    if (!deptId) throw new AppError(ErrorCode.PARAM_MISSING);
    const res = await SysDept.findOne({ where: { deptId } });
    return res;
  }

  async editDept(params) {
    const { deptId, ...rest } = params;
    await SysDept.update({ ...rest }, { where: { deptId } });
  }

  async addDept(params) {
    await SysDept.create(params);
  }

  async deleteDept(params) {
    const { ids } = params;
    if (!ids) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysDept.destroy({ where: { deptId: { [Op.in]: ids.split(",") } } });
  }
}

module.exports = new DeptService();
