const { Op } = require("sequelize");
const SYSTEM = require("@/constants/cache");
const { ErrorCode } = require("@/constants/stateCode");
const { SysDictType, SysDictData } = require("@/core/database/models");
const redis = require("@/core/redis");
const AppError = require("@/utils/AppError");

class DictService {
  async init() {
    await SysDictType.sync();
    await SysDictData.sync();
    const dictDataList = await SysDictData.findAll();
    const dictTypeMap = {};
    dictDataList.forEach(item => {
      dictTypeMap[item.dictType] = dictTypeMap[item.dictType] || [];
      dictTypeMap[item.dictType].push(item);
    });

    Object.keys(dictTypeMap).forEach(async dictType => {
      await redis.set(`${SYSTEM.SYS_DICT_KEY}${dictType}`, dictTypeMap[dictType]);
    });
  }

  async getDictTypeList(params) {
    const { dictName, dictType, status, pageNum = 1, pageSize = 10 } = params;
    const where = {};
    if (dictName) {
      where.dictName = { [Op.like]: `%${dictName}%` };
    }
    if (dictType) {
      where.dictType = { [Op.like]: `%${dictType}%` };
    }
    if (status) {
      where.status = status;
    }
    const offset = (pageNum - 1) * pageSize;
    const limit = Number(pageSize);
    const dictTypeList = await SysDictType.findAndCountAll({
      where,
      offset,
      limit,
    });
    return [dictTypeList.rows, dictTypeList.count];
  }

  async getDictTypeOptionSelect() {
    const dictTypeOptionSelect = await SysDictType.findAll({});
    return dictTypeOptionSelect;
  }

  async getDictInfo(params) {
    const { id } = params;
    if (!id) throw new AppError(ErrorCode.PARAM_MISSING);
    const dictType = await SysDictType.findOne({ where: { dictId: id } });
    return dictType;
  }

  async addDictType(params) {
    await SysDictType.create(params);
    this.init();
  }

  async updateDictType(params) {
    await SysDictType.update({ ...params }, { where: { dictId: params.dictId } });
    this.init();
  }

  async deleteDictType(params) {
    const { ids } = params;
    if (!ids) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysDictType.destroy({
      where: { dictId: { [Op.in]: ids.split(",") } },
    });
    this.init();
  }

  async getDictDataList(params) {
    const { dictType, dictName, pageNum, pageSize } = params;
    const where = {};
    if (dictType) {
      where.dictType = dictType;
    }
    if (dictName) {
      where.dictName = { [Op.like]: `%${dictName}%` };
    }
    const result = await SysDictData.findAll({
      where,
      limit: Number(pageSize),
      offset: (pageNum - 1) * pageSize,
    });
    return result;
  }

  async getDictDataValue(params) {
    const { dictType } = params;
    if (!dictType) throw new AppError(ErrorCode.PARAM_MISSING);
    const dictDataValue = await SysDictData.findAll({
      where: { dictType },
    });
    return dictDataValue;
  }

  async getDictData(params) {
    const { dictCode } = params;
    if (!dictCode) throw new AppError(ErrorCode.PARAM_MISSING);
    const dictData = await SysDictData.findOne({ where: { dictCode } });
    return dictData;
  }

  async addDictData(params) {
    await SysDictData.create(params);
    this.init();
  }

  async updateDictData(params) {
    const { dictCode, ...rest } = params;
    await SysDictData.update({ ...rest }, { where: { dictCode } });
    this.init();
  }

  async deleteDictData(params) {
    const { dictCodes } = params;
    if (!dictCodes) throw new AppError(ErrorCode.PARAM_MISSING);
    await SysDictData.destroy({
      where: { dictCode: { [Op.in]: dictCodes.split(",") } },
    });
    this.init();
  }
}
module.exports = new DictService();
