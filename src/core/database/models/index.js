const database = require("../index");

// 加载模型
const { initModels } = require("./init-models");

const models = initModels(database.init());
const {
  SysConfig,
  SysDept,
  SysDictData,
  SysDictType,
  SysLogininfor,
  SysMenu,
  SysNotice,
  SysOperLog,
  SysPost,
  SysRole,
  SysRoleDept,
  SysRoleMenu,
  SysUser,
  SysUserPost,
  SysUserRole,
} = models;
SysMenu.belongsToMany(SysRole, {
  otherKey: "roleId",
  foreignKey: "menuId",
  through: SysRoleMenu,
});
SysRole.belongsToMany(SysMenu, {
  otherKey: "menuId",
  foreignKey: "roleId",
  through: SysRoleMenu,
});

SysUser.belongsToMany(SysRole, {
  through: SysUserRole,
  foreignKey: "userId",
  otherKey: "roleId",
});
SysRole.belongsToMany(SysUser, {
  through: SysUserRole,
  foreignKey: "roleId",
  otherKey: "userId",
});

SysRole.belongsToMany(SysDept, {
  otherKey: "deptId",
  foreignKey: "roleId",
  through: SysRoleDept,
});
SysDept.belongsToMany(SysRole, {
  otherKey: "roleId",
  foreignKey: "deptId",
  through: SysRoleDept,
});

SysUser.belongsToMany(SysPost, {
  otherKey: "postId",
  foreignKey: "userId",
  through: SysUserPost,
});
SysPost.belongsToMany(SysUser, {
  otherKey: "userId",
  foreignKey: "postId",
  through: SysUserPost,
});

SysUser.hasMany(SysDept, { foreignKey: "deptId", sourceKey: "deptId" });
SysDept.hasMany(SysRoleDept, { foreignKey: "deptId", sourceKey: "deptId" });
module.exports = models;
