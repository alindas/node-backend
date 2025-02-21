const { Op } = require("sequelize");
const SYSTEM = require("@/constants/cache");
const { SysLogininfor, SysOperLog } = require("@/core/database/models");
const redis = require("@/core/redis");

class MonitorService {
  async getLogininforList(params) {
    const { pageNum, pageSize } = params;
    const offset = (pageNum - 1) * pageSize;
    const limit = parseInt(pageSize, 10);
    const res = await SysLogininfor.findAndCountAll({
      offset,
      limit,
      order: [["loginTime", "DESC"]],
    });
    return [res.rows, res.count];
  }

  async deleteLogininfor(infoIds) {
    await SysLogininfor.destroy({
      where: { infoId: { [Op.in]: infoIds.split(",") } },
    });
  }

  async logininforClean() {
    await SysLogininfor.destroy({ truncate: true });
  }

  async unlockLogininfor(username) {
    redis.set(`${SYSTEM.RETRY_COUNT}${username}`, "0");
    redis.del(`${SYSTEM.LOGIN_STATUS}${username}`);
  }

  async getOperlogList(params) {
    const { businessType, title, pageNum, pageSize } = params;
    const offset = (pageNum - 1) * pageSize;
    const limit = parseInt(pageSize, 10);
    const where = {};
    if (businessType) where.businessType = businessType;
    if (title) where.title = { [Op.like]: `%${title}%` };
    const res = await SysOperLog.findAndCountAll({
      where,
      offset,
      limit,
      order: [["operTime", "DESC"]],
    });
    return [res.rows, res.count];
  }

  async operlogClean() {
    await SysOperLog.destroy({ truncate: true });
  }

  async deleteOperlog(operIds) {
    await SysOperLog.destroy({
      where: { operId: { [Op.in]: operIds.split(",") } },
    });
  }
}

module.exports = new MonitorService();
