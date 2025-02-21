var DataTypes = require("sequelize").DataTypes;
var _SysConfig = require("./sys_config");
var _SysDept = require("./sys_dept");
var _SysDictData = require("./sys_dict_data");
var _SysDictType = require("./sys_dict_type");
var _SysLogininfor = require("./sys_logininfor");
var _SysMenu = require("./sys_menu");
var _SysNotice = require("./sys_notice");
var _SysOperLog = require("./sys_oper_log");
var _SysPost = require("./sys_post");
var _SysRole = require("./sys_role");
var _SysRoleDept = require("./sys_role_dept");
var _SysRoleMenu = require("./sys_role_menu");
var _SysUser = require("./sys_user");
var _SysUserPost = require("./sys_user_post");
var _SysUserRole = require("./sys_user_role");

function initModels(sequelize) {
  var SysConfig = _SysConfig(sequelize, DataTypes);
  var SysDept = _SysDept(sequelize, DataTypes);
  var SysDictData = _SysDictData(sequelize, DataTypes);
  var SysDictType = _SysDictType(sequelize, DataTypes);
  var SysLogininfor = _SysLogininfor(sequelize, DataTypes);
  var SysMenu = _SysMenu(sequelize, DataTypes);
  var SysNotice = _SysNotice(sequelize, DataTypes);
  var SysOperLog = _SysOperLog(sequelize, DataTypes);
  var SysPost = _SysPost(sequelize, DataTypes);
  var SysRole = _SysRole(sequelize, DataTypes);
  var SysRoleDept = _SysRoleDept(sequelize, DataTypes);
  var SysRoleMenu = _SysRoleMenu(sequelize, DataTypes);
  var SysUser = _SysUser(sequelize, DataTypes);
  var SysUserPost = _SysUserPost(sequelize, DataTypes);
  var SysUserRole = _SysUserRole(sequelize, DataTypes);

  return {
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
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
