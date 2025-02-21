const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysUserRole",
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "用户ID",
        field: "user_id",
      },
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
        field: "role_id",
      },
    },
    {
      tableName: "sys_user_role",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }, { name: "role_id" }],
        },
      ],
    },
  );
};
