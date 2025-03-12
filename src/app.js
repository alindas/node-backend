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

    // 监听系统 SIGTERM 信号，通常用于请求程序优雅地终止。
    // 这个信号通常由操作系统发送，例如在使用 kill 命令时，或者在容器编排系统（如 Kubernetes）中终止容器时
    process.on("SIGTERM", () => {
      appLogger.info("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        appLogger.info("Server closed");
        process.exit(0); // 正常退出
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
    process.exit(1); // 异常退出
  });

  /**
   * process.exit(0) && process.exit(1)
   * 0 表示正常退出，1 表示异常退出
   * 使用不同的退出码可为服务宿主提供不同的信号，以指示服务的状态。
   * 例如，设置异常退出，宿主 Docker 可鉴于异常退出进行服务重启
   */
