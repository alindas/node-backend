const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysConfig",
    {
      configId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "参数主键",
        field: "config_id",
      },
      configName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "参数名称",
        field: "config_name",
      },
      configKey: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "参数键名",
        field: "config_key",
      },
      configValue: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "",
        comment: "参数键值",
        field: "config_value",
      },
      configType: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "N",
        comment: "系统内置（Y是 N否）",
        field: "config_type",
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
      tableName: "sys_config",
      hasTrigger: true,
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
          fields: [{ name: "config_id" }],
        },
      ],
    },
  );
};
