require("./utils/registerPath");
const Koa = require("koa");
const config = require("@/config");
const bootstrap = require("@/core/bootstrap");
const { appLogger } = require("@/core/log");
const moduleLoader = require("@/core/router");
const SYSTEM = require("./constants/cache");

const app = new Koa();
const port = config.get("server.port");
let host = config.get("server.host");
if (host === "localhost") {
  host = "127.0.0.1";
}

// 启动应用
bootstrap(app)
  .then(async () => {
    // 加载所有模块路由
    const router = await moduleLoader.loadModules();

    // 注册路由中间件
    app.use(router.routes());
    app.use(router.allowedMethods());
    // 启动服务器
    const server = app
      .listen(port, () => {
        appLogger.info(`Server started at http://${host}:${port}${SYSTEM.API_PREFIX}`);
      })
      .on("error", err => {
        if (err.code === "EADDRINUSE") {
          appLogger.error(`Port ${port} is already in use`);
        } else {
          appLogger.error("Server startup error:", err);
        }
        process.exit(1);
      });

    process.on("SIGTERM", () => {
      appLogger.info("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        appLogger.info("Server closed");
        process.exit(0);
      });
    });

    // 错误处理
    app.on("error", err => {
      appLogger.error("Server error:", err);
    });

    // 未捕获的异常
    process.on("uncaughtException", err => {
      appLogger.error("Uncaught Exception:", err);
    });

    // Promise 异常
    process.on("unhandledRejection", err => {
      appLogger.error("Unhandled Rejection:", err);
    });
  })
  .catch(error => {
    appLogger.error("Failed to start server:", error);
    process.exit(1);
  });
