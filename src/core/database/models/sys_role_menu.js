const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysRoleMenu",
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
        field: "role_id",
      },
      menuId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "菜单ID",
        field: "menu_id",
      },
    },
    {
      tableName: "sys_role_menu",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "role_id" }, { name: "menu_id" }],
        },
      ],
    },
  );
};
