const koaBody = require("koa-body").default;
const json = require("koa-json");
const session = require("koa-session");
const useragent = require("koa-useragent").default;
const cors = require("@koa/cors");
const crypto = require("crypto");
const { resolve } = require("path");
const fs = require("fs");
const serve = require("koa-static");
const config = require("@/config");
const { verifyToken } = require("@/middlewares/Auth.middleware");
const { errorHandler, notFoundHandler } = require("@/middlewares/errorHandler.middleware");
const accessLogger = require("@/middlewares/Access.middlerware");
const SYSTEM = require("@/constants/cache");
const { appLogger } = require("@/core/log");

const uploadDir = resolve(__dirname, "../../../public");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const initMiddleware = app => {
  // 错误处理中间件应该放在最前面
  app.use(errorHandler);
  // 访问日志
  app.use(accessLogger);
  // 基础中间件
  /**
   * 解析请求头中的 User-Agent 信息
   * 常见的有 设备信息、操作系统、浏览器信息、其他信息
   */
  app.use(useragent);
  // 集成文件上传 会把上传的文件挂在在 ctx.request.files 上
  app.use(
    koaBody({
      multipart: true,
      formidable: {
        uploadDir,
        keepExtensions: true,
        maxFiles: 3,
        filename: (name, ext) => {
          // 校验文件类型
          const allowTypes = Object.values(config.get("upload.allowTypes"));
          if (!allowTypes.includes(ext)) {
            throw new Error("文件类型不允许");
          }
          return name + ext;
        },
      },
    }),
  );
  app.use(json());

  // 静态资源服务器 指定下请求路径
  app.use(serve(uploadDir, { prefix: SYSTEM.ASSETS_PREFIX }));
  const host = config.get("server.host");
  const port = config.get("server.port");
  appLogger.info("静态资源服务器地址：%s", `http://${host}:${port}${SYSTEM.ASSETS_PREFIX}`);

  // CORS配置
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );
  app.use(verifyToken);
  // Session配置
  // 生成随机的session密钥
  const sessionSecret = crypto.randomBytes(32).toString("hex");
  appLogger.info(`sessionSecret: ${sessionSecret}`);
  app.keys = [sessionSecret];
  app.use(session(app));
  // 404处理放在路由之后
  app.use(notFoundHandler);

  return app;
};

module.exports = initMiddleware;
