const SYSTEM = {
  /**
   * 应用版本
   */
  APP_VERSION: "system:app:version",
  /**
   * api前缀
   */
  API_PREFIX: "/api",
  /**
   * 超管权限标识key
   */
  SUPER_ADMIN_KEY: "admin",
  /**
   * 资源文件前缀
   */
  ASSETS_PREFIX: "/assets",
  /**
   *SECRET
   */
  SECRET: "your-secret-key",
  /**
   * 用户信息
   */
  USER_KEY: "user_info:",
  /**
   * 白名单
   */
  WHITE_LIST: ["/login", "/captcha"],
  /**
   * 用户权限
   */
  PERMISSION_KEY: "user_permissions:",
  /**
   * 用户角色
   */
  ROLE_PREFIX: "user_roles:",
  /**
   * 基础密码
   */
  BASE_PWD: "123456",
  /**
   * token
   */
  TOKEN_KEY: "login_tokens:",
  /**
   * 锁定用户
   */
  LOCKED_USER: "locked_user:",
  /**
   * 验证码
   */
  CAPTCHA_KEY: "captcha_codes:",
  /**
   * 重试次数
   */
  RETRY_COUNT: "retry_count:",
  /**
   * 验证码 redis key
   */
  CAPTCHA_CODE_KEY: "captcha_codes:",

  /**
   * 参数管理 cache key
   */
  SYS_CONFIG_KEY: "sys_config:",

  /**
   * 字典管理 cache key
   */
  SYS_DICT_KEY: "sys_dict:",

  /**
   * 防重提交 redis key
   */
  REPEAT_SUBMIT_KEY: "repeat_submit:",
  /**
   * 限流 redis key
   */
  RATE_LIMIT_KEY: "rate_limit:",

  /**
   * 登录账户密码错误次数 redis key
   */
  PWD_ERR_CNT_KEY: "pwd_err_cnt:",

  /**
   * 密码重试次数
   */
  PWD_RETRY_CNT: 5,
  /**
   * 缓存过期时间
   */
  CACHE_TTL: {
    /**
     * token过期时间
     */
    TOKEN_EXPIRES_IN: 24 * 60 * 60,
    /**
     * 验证码过期时间
     */
    CAPTCHA_CODE_KEY: 1 * 60,
    /**
     * 小时
     */
    HOUR: 60 * 60,
    /**
     * 天
     */
    DAY: 24 * 60 * 60,
    /**
     * 周
     */
    WEEK: 7 * 24 * 60 * 60,
    /**
     * 月
     */
    MONTH: 30 * 24 * 60 * 60,
  },
};

module.exports = SYSTEM;
