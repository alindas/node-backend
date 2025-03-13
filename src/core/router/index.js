const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
const SYSTEM = require("@/constants/cache");

class ModuleLoader {
  constructor(opts = {}) {
    this.rootRouter = new Router(opts);
  }

  // 加载所有模块路由
  async loadModules() {
    // __dirname 是当前脚本的绝对路径
    const modulesPath = path.join(__dirname, "../../modules");
    // 遍历模块目录
    await this.loadModuleRoutes(modulesPath);
    return this.rootRouter;
  }

  // 递归加载模块路由
  async loadModuleRoutes(dirPath) {
    // 同步读取目录下的所有文件和子目录
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      // 如果是目录则递归加载
      if (stat.isDirectory()) {
        await this.loadModuleRoutes(fullPath);
      } else if (file === "route.js") { // 找到路由文件 route.js
        const router = require(fullPath);
        if (router && router.routes) {
          // 注册路由到统一节点
          this.rootRouter.use(router.routes());
          this.rootRouter.use(router.allowedMethods());
          // console.log(
          //   `当前模块【${path.relative(__dirname, fullPath)}】注册的路由:`,
          //   router.stack.map(layer => ({
          //     path: layer.path,
          //     methods: layer.methods,
          //   })),
          // );
        }
      }
    }
  }
}
module.exports = new ModuleLoader({ prefix: SYSTEM.API_PREFIX });
