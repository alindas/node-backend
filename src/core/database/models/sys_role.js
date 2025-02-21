const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "SysRole",
    {
      roleId: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
        field: "role_id",
      },
      roleName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: "角色名称",
        field: "role_name",
      },
      roleKey: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "角色权限字符串",
        field: "role_key",
      },
      roleSort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "显示顺序",
        field: "role_sort",
      },
      dataScope: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "1",
        comment:
          "数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）",
        field: "data_scope",
      },
      menuCheckStrictly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: "菜单树选择项是否关联显示",
        field: "menu_check_strictly",
      },
      deptCheckStrictly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: "部门树选择项是否关联显示",
        field: "dept_check_strictly",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        comment: "角色状态（0正常 1停用）",
      },
      delFlag: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "删除标志（0代表存在 2代表删除）",
        field: "del_flag",
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
      tableName: "sys_role",
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
          fields: [{ name: "role_id" }],
        },
      ],
    },
  );
};
