const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysRoleDept",
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
        field: "role_id",
      },
      deptId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "部门ID",
        field: "dept_id",
      },
    },
    {
      tableName: "sys_role_dept",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      comment: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "role_id" }, { name: "dept_id" }],
        },
      ],
    },
  );
};
