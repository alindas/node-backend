const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysPost",
    {
      postId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "岗位ID",
        field: "post_id",
      },
      postCode: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "岗位编码",
        field: "post_code",
      },
      postName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "岗位名称",
        field: "post_name",
      },
      postSort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "显示顺序",
        field: "post_sort",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
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
      tableName: "sys_post",
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
          fields: [{ name: "post_id" }],
        },
      ],
    },
  );
};
