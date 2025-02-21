const winstonConfig = {
  // 日志级别定义
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  // 日志分类
  categories: {
    app: "app",
    sql: "sql",
    error: "error",
  },
  // 日志级别颜色
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

module.exports = winstonConfig;
