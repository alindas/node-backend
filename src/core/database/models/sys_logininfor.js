const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysLogininfor",
    {
      infoId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "访问ID",
        field: "info_id",
      },
      userName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: "用户账号",
        field: "user_name",
      },
      ipaddr: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: "",
        comment: "登录IP地址",
      },
      loginLocation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        comment: "登录地点",
        field: "login_location",
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: "浏览器类型",
      },
      os: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: "操作系统",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "登录状态（0成功 1失败）",
      },
      msg: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        comment: "提示消息",
      },
      loginTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "访问时间",
        field: "login_time",
      },
    },
    {
      tableName: "sys_logininfor",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "info_id" }],
        },
        {
          name: "idx_sys_logininfor_s",
          using: "BTREE",
          fields: [{ name: "status" }],
        },
        {
          name: "idx_sys_logininfor_lt",
          using: "BTREE",
          fields: [{ name: "login_time" }],
        },
      ],
    },
  );
};
