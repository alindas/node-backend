const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysDictData",
    {
      dictCode: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "字典编码",
        field: "dict_code",
      },
      dictSort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "字典排序",
        field: "dict_sort",
      },
      dictLabel: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典标签",
        field: "dict_label",
      },
      dictValue: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典键值",
        field: "dict_value",
      },
      dictType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典类型",
        field: "dict_type",
      },
      cssClass: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "样式属性（其他样式扩展）",
        field: "css_class",
      },
      listClass: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "表格回显样式",
        field: "list_class",
      },
      isDefault: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "N",
        comment: "是否默认（Y是 N否）",
        field: "is_default",
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
      tableName: "sys_dict_data",
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
          fields: [{ name: "dict_code" }],
        },
      ],
    },
  );
};
