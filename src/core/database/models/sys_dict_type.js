const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysDictType",
    {
      dictId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "字典主键",
        field: "dict_id",
      },
      dictName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典名称",
        field: "dict_name",
      },
      dictType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典类型",
        unique: "dict_type",
        field: "dict_type",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "状态（0正常 1停用）",
      },
      createBy: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: "",
        comment: "创建者",
        field: "create_by",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "创建时间",
        field: "create_time",
      },
      updateBy: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: "",
        comment: "更新者",
        field: "update_by",
      },
      updateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "更新时间",
        field: "update_time",
      },
      remark: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "备注",
      },
    },
    {
      tableName: "sys_dict_type",
      timestamps: true,
      createdAt: "createTime",
      updatedAt: "updateTime",
      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "dict_id" }],
        },
        {
          name: "dict_type",
          unique: true,
          using: "BTREE",
          fields: [{ name: "dict_type" }],
        },
      ],
    },
  );
};
