const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysNotice",
    {
      noticeId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "公告ID",
        field: "notice_id",
      },
      noticeTitle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "公告标题",
        field: "notice_title",
      },
      noticeType: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        comment: "公告类型（1通知 2公告）",
        field: "notice_type",
      },
      noticeContent: {
        type: DataTypes.BLOB,
        allowNull: true,
        comment: "公告内容",
        field: "notice_content",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "公告状态（0正常 1关闭）",
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
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "备注",
      },
    },
    {
      tableName: "sys_notice",
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
          fields: [{ name: "notice_id" }],
        },
      ],
    },
  );
};
