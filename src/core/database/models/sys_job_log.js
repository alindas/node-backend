const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysJobLog",
    {
      jobLogId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "任务日志ID",
        field: "job_log_id",
      },
      jobName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "任务名称",
        field: "job_name",
      },
      jobGroup: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "任务组名",
        field: "job_group",
      },
      invokeTarget: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "调用目标字符串",
        field: "invoke_target",
      },
      jobMessage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "日志信息",
        field: "job_message",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "执行状态（0正常 1失败）",
      },
      exceptionInfo: {
        type: DataTypes.STRING(2000),
        allowNull: true,
        defaultValue: "",
        comment: "异常信息",
        field: "exception_info",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "创建时间",
        field: "create_time",
      },
    },
    {
      tableName: "sys_job_log",
      timestamps: true,
      createdAt: "createTime",

      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "job_log_id" }],
        },
      ],
    },
  );
};
