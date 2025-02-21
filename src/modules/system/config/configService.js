const { Op } = require("sequelize");
const SYSTEM = require("@/constants/cache");
const { ErrorCode } = require("@/constants/stateCode");
const { SysConfig } = require("@/core/database/models");
const redis = require("@/core/redis");
const AppError = require("@/utils/AppError");
const { appLogger } = require("@/core/log");

class ConfigService {
  // 初始化执行  把config输入存入redis
  async init() {
    const res = await SysConfig.findAll();
    const promise = res.map(item => {
      const key = `${SYSTEM.SYS_CONFIG_KEY}${item.configKey}`;
      return redis.set(key, item.configValue);
    });
    await Promise.all(promise);
    appLogger.info("system config init successfully");
  }

  async getConfigList(params) {
    const { configName, configKey, pageNum = 1, pageSize = 10, configType } = params;
    const where = {};
    if (configName) where.configName = configName;
    if (configKey) where.configKey = configKey;
    if (configType) where.configType = configType;
    const limit = Number(pageSize);
    const offset = (pageNum - 1) * limit;
    const res = await SysConfig.findAndCountAll({ where, offset, limit });
    return [res.rows, res.count];
  }

  async getConfigInfo(params) {
    const { configId } = params;
    if (!configId) throw new AppError(ErrorCode.PARAM_MISSING);
    const res = await SysConfig.findOne({ where: { configId } });
    return res;
  }

  async addConfig(params) {
    await SysConfig.create(params);
  }

  async editConfig(params) {
    const { configId, ...rest } = params;
    await SysConfig.update({ ...rest }, { where: { configId } });
  }

  async deleteConfig(params) {
    const { configIds } = params;
    if (!configIds) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysConfig.destroy({
      where: { configId: { [Op.in]: configIds.split(",") } },
    });
  }
}

module.exports = new ConfigService();
