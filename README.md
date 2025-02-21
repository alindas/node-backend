# 开发

## 环境

- node >=18
- mysql 8.0
- redis 未做限制

## 准备

- 导入init.sql 文件到数据库
- 修改env/default.yml 文件的配置
**以下操作直接拉取项目可忽略**
- 执行 `npm run add:model`
  - 介绍下此脚本的内容
  - 1: `addAuditFields(tableName, flag = "")` 给表添加审计字段
  - 2: `generateModelsByTable(tableName)` 根据表名生成模型
  - 3: `tableName` 表名
  - 4: `flag` 审计字段类型：'time'|'by'|'all'
  - 5: time 添加 createTime, updateTime 字段
  - 6: by 添加 createBy, updateBy 字段
  - 7: all 添加 createTime, updateTime, createBy, updateBy 字段
  - 8: 生成的新模型在 `core/database/models` 文件夹下

## 数据权限的使用

- 当前登录角色的 数据权限或者登录后 添加到角色信息的 redis内存中
- 查询表时需要数据权限的 请 引入 `@/utils/tool.js` 中的 `getUserCondition` 方法
  - `getUserCondition(ctx)` 接受的参数自由一个 可以是 `ctx, dto[user], userName`
  - 返回的是一个sequelize的 or查询条件 可以 `const where ={ ...(await getUserCondition(ctx)) }`

## 开发规范

### 1 文件规范

- 公共中间件请在 `src/middlewares/` 下创建文件夹，文件夹名称为中间件名
- 公共方法请在 `src/utils/` 下补充
- 公共配置请在 `env/default.yml` 补充
- 公共工具请在 `src/tools.js` 中补充
- 公共常量请在 `src/constants/` 文件下补充

- 业务代码请在 `src/modules/` 下创建文件夹，文件夹名称为模块名
- `public` 文件夹是静态资源文件夹，请将静态资源文件放在该文件夹下
  - formData 中的文件会统一在 public 下

### 2 业务代码(请遵循MVC架构)

- controller 请在 `src/modules/模块名/xxxController.js` 中补充
  - 全局做了错误捕获,请报错是 使用 `throw new AppError({code}, message)`
  - `src/constants/stateCode.js` 中定义了错误码 请使用 `throw new AppError(ErrorCode.xxxx)`

- service 请在 `src/modules/模块名/xxxService.js` 中补充
  - service中的方法请尽可能的简单，不要出现业务逻辑
- router 请在 `src/modules/模块名/router.js` 中补充
  - 请严格遵顼restful api 规范

# 部署

### 1 服务器部署

> - 1.1 安装node
> - 1.2 执行 npm install
> - 1.3 执行 npm run build
> - 1.4 执行 npm run start

### 2 pm2部署

> 修改 `ecosystem.config.js` 中的 `env` 参数 和最后的启动执行(此处默认是 `pm2:prod`)

### 3 docker 部署

> 直接执行 `npm run docker:build` 即可


# 提交

**形目中配置了提交规范可供选择**
** 提交前会自动执行 lint 和 format 命令**
** 不符合提交规范会失败**

## 使用方法

- git add .
- 使用`npx cz` 代替 `git commit` 此时命令行会出现供选择的提交类型
- 选择提交类型后，输入提交信息 会自动合并生成符合提交规范的提交信息，并自动执行 `git commit`

## 提交类型

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式(不影响代码运行的变动)
- refactor: 重构(既不是增加feature，也不是修复bug)
- ...(具体内容查看.czrc文件)

# 文件结构

nodesj_new_version
├── Dockerfile 部署文件
├── README.md 说明文件
├── commitlint.config.js commitlint配置文件
├── docker-compose.yml docker-compose部署文件
├── docker-deploy.sh docker-compose部署脚本
├── ecosystem.config.js pm2部署配置文件
├── jsconfig.json
├── logs 日志文件夹
│ ├── app 应用日志
│ ├── error 错误日志
│ └── sql 数据库日志
├── package.json 项目配置文件
├── pnpm-lock.yaml
├── src
│ ├── app.js 项目入口文件
│ ├── config
│ │ ├── env
│ │ │ ├── default.yml 默认配置文件
│ │ │ ├── development.yml 开发环境配置文件
│ │ │ └── production.yml 生产环境配置文件
│ │ └── index.js 配置文件入口
│ ├── constants
│ │ ├── cache.js 缓存配置
│ │ └── stateCode.js 状态码配置
│ ├── core
│ │ ├── bootstrap
│ │ │ ├── database.js 数据库配置
│ │ │ ├── index.js 核心配置
│ │ │ ├── middleware.js 中间件配置
│ │ │ └── other.js 其他配置
│ │ ├── database
│ │ │ ├── client.js 数据库客户端
│ │ │ ├── config.js 数据库配置
│ │ │ ├── generator.js 数据库生成器
│ │ │ ├── index.js 数据库入口
│ │ │ ├── models 数据库模型
│ │ │ └── skiptable.js 跳过表配置
│ │ ├── log
│ │ │ ├── config.js 日志配置
│ │ │ └── index.js 日志入口
│ │ ├── redis
│ │ │ ├── client.js 数据库客户端
│ │ │ ├── config.js 数据库配置
│ │ │ └── index.js
│ │ └── router
│ │ └── index.js 路由入口
│ ├── decorator
│ │ ├── index.js 装饰器入口
│ │ ├── log.decorator.js 日志装饰器
│ │ ├── loginLog.decorator.js 登录日志装饰器
│ │ └── permissions.decorator.js 权限装饰器
│ ├── middlewares
│ │ ├── Access.middlerware.js 访问控制中间件
│ │ ├── Auth.middleware.js 认证中间件
│ │ └── errorHandler.middleware.js 错误处理中间件
│ ├── modules
│ │ ├── auth
│ │ │ ├── authController.js 认证控制器
│ │ │ ├── authService.js 认证服务
│ │ │ └── route.js 认证路由
│ │ ├── pubilc
│ │ │ ├── controller.js 公共控制器
│ │ │ ├── route.js 公共路由
│ │ │ └── service.js 公共服务
│ │ └── system
│ │ ├── config 配置
│ │ ├── dept 部门
│ │ ├── dict 字典
│ │ ├── menu 菜单
│ │ ├── monitor 监控
│ │ ├── post 岗位
│ │ ├── role 角色
│ │ └── user 用户
│ ├── scripts
│ │ └── add-audit-fields.js 添加审计字段脚本
│ └── utils
│ ├── AppError.js 错误处理
│ ├── env.js 环境变量
│ ├── functional.js 功能函数
│ ├── network
│ │ ├── httpClient.js 网络请求
│ │ ├── kafkaServer.js kafka服务
│ │ ├── wsClient.js ws客户端
│ │ └── wsServer.js ws服务端
│ ├── pem.js 密钥
│ └── tool.js 工具
