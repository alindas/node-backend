const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysUserPost",
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "用户ID",
        field: "user_id",
      },
      postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "岗位ID",
        field: "post_id",
      },
    },
    {
      tableName: "sys_user_post",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }, { name: "post_id" }],
        },
      ],
    },
  );
};
