const ErrorCode = {
  // 系统级错误 (1000-1999)
  SYSTEM_ERROR: { code: 1000, message: "系统内部错误" },
  SERVICE_UNAVAILABLE: { code: 1001, message: "服务不可用" },
  UNKNOWN_ERROR: { code: 1002, message: "未知错误" },

  // 认证和授权错误 (2000-2999)
  UNAUTHORIZED: { code: 2000, message: "未授权，请登录" },
  PERMISSION_DENIED: { code: 2001, message: "权限不足" },
  USER_NOT_FOUND: { code: 2002, message: "用户不存在" },
  USER_LOCKED: { code: 2003, message: "用户已被锁定" },
  USER_PASSWORD_ERROR: { code: 2004, message: "用户密码错误" },
  BLACKLIST_IP: { code: 2005, message: "此ip在黑名单中" },
  CAPTCHA_EXPIRED: { code: 2006, message: "验证码已过期" },
  CAPTCHA_ERROR: { code: 2007, message: "验证码错误" },
  USER_DISABLED: { code: 2008, message: "用户已被禁用" },

  // 请求参数错误 (3000-3999)
  PARAM_ERROR: { code: 3000, message: "参数错误" },
  PARAM_MISSING: { code: 3001, message: "缺少必要参数" },
  PARAM_TYPE_ERROR: { code: 3002, message: "参数类型错误" },

  // 业务逻辑错误 (4000-4999)
  BUSINESS_ERROR: { code: 4000, message: "业务处理失败" },
  RESOURCE_NOT_FOUND: { code: 4001, message: "资源不存在" },
  RESOURCE_ALREADY_EXIST: { code: 4002, message: "资源已存在" },

  // 第三方服务错误 (5000-5999)
  EXTERNAL_SERVICE_ERROR: { code: 5000, message: "外部服务调用失败" },
  DATABASE_ERROR: { code: 5001, message: "数据库操作失败" },
  REDIS_ERROR: { code: 5002, message: "Redis操作失败" },

  // 用户错误 (6000-6999)
  UNAUTHORIZED_CODE: 401, // 未登录or登录失效
  FORBIDDEN_CODE: 403, // 无权限
};
const SuccessCode = { code: 0, message: "SUCCESS" };
module.exports = {
  ErrorCode,
  SuccessCode,
};
