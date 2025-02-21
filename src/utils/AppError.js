class AppError extends Error {
  constructor(errorInfo, msg = null) {
    super(errorInfo.message);

    this.name = this.constructor.name;
    this.code = errorInfo.code;
    this.msg = msg;

    // 捕获堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      msg: this.msg,
    };
  }
}

module.exports = AppError;
