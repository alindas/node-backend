const SYSTEM = require("@/constants/cache");
const { ErrorCode } = require("@/constants/stateCode");
const redis = require("@/core/redis");
const authService = require("@/modules/auth/authService");
const userService = require("@/modules/system/user/userService");
const AppError = require("@/utils/AppError");
const { jwtTools } = require("@/utils/tool");
/**
 * 验证 Token
 */
const verifyToken = async (ctx, next) => {
  // 白名单或者资源文件直接放行
  const path = ctx.path.startsWith(SYSTEM.API_PREFIX)
    ? ctx.path.replace(SYSTEM.API_PREFIX, "")
    : ctx.path;
  if (SYSTEM.WHITE_LIST.includes(path) || path.startsWith(SYSTEM.ASSETS_PREFIX)) {
    return next();
  }
  const token = ctx.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "未登录或登录已过期");
  }
  // 验证token
  const decoded = jwtTools.verifyToken(token);
  // 从Redis获取token信息
  const tokenKey = `${SYSTEM.TOKEN_KEY}${decoded.uuid}`;

  const redisToken = await redis.get(tokenKey);

  // token不存在或已失效  存储时已经设置了key的过期时间
  if (!redisToken) {
    throw new AppError(ErrorCode.TOKEN_INVALID, "token已失效");
  }
  // 从redis提取当前用户
  let user;
  user = await redis.get(SYSTEM.USER_KEY + decoded.username);
  if (!user) {
    user = await userService.getUserInfoByUserId(decoded.id);
    if (!user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "用户不存在");
    }
    const belongNames = await userService.getBelongName(user);
    const { roles, permissions } = await authService.getUserInfo(user);
    user.permissions = permissions;
    user.belongUsers = belongNames;
    user.roles = roles;
    user.uuid = decoded.uuid;
    // 缓存用户信息到redis
    await redis.setex(SYSTEM.USER_KEY + user.userName, SYSTEM.CACHE_TTL.TOKEN_EXPIRES_IN, user);
  }
  ctx.state.user = user;
  return next();
};

module.exports = {
  verifyToken,
};
