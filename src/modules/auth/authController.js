const { LoginLog } = require("@/decorator");
const ResponceBody = require("@/utils/responceBody");
const service = require("./authService");

class AuthController {
  // 登录
  @LoginLog("0", "登录成功")
  async login(ctx) {
    const { user, token } = await service.validateLogin(ctx.request.body, ctx);
    ctx.body = ResponceBody.successBody({ token }, "登录成功");
  }

  // 获取验证码
  async captcha(ctx) {
    const result = await service.generateCaptcha();
    ctx.session.captcha = result.text.toLowerCase();
    ctx.body = ResponceBody.successBody({ data: result }, "获取验证码成功");
  }

  // 退出
  @LoginLog("0", "退出成功")
  async logout(ctx) {
    await service.logOut(ctx.state.user);
    ctx.body = ResponceBody.successBody({}, "退出成功");
  }

  // 获取用户信息
  async userInfo(ctx) {
    const result = await service.getUserInfo(ctx.state.user);
    ctx.body = ResponceBody.successBody(
      {
        user: ctx.state.user,
        roles: result.role,
        permissions: result.permissions,
      },
      "获取用户信息成功",
    );
  }

  // 获取路由
  async getRouters(ctx) {
    const { userId } = ctx.state.user;
    const routers = await service.getRouters(userId);
    ctx.body = ResponceBody.successBody({ data: routers }, "获取路由成功");
  }

  // 获取公钥
  async getPublicKey(ctx) {
    const publicKey = await service.getPublicKey();
    ctx.body = ResponceBody.successBody({ data: publicKey }, "获取公钥成功");
  }
}

module.exports = new AuthController();
