const path = require("path");
const fs = require("fs");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("@/config");
const util = require("util");
const winstonConfig = require("./config");

const { format } = winston;
// 确保日志目录存在
/**
 * process.cwd() 方法返回 Node.js 进程的当前工作目录。
 */
const logDir = path.join(process.cwd(), "logs");
const categories = Object.values(winstonConfig.categories);
/**
 * 根据配置文件中的日志分类创建相应的日志目录。
 */
categories.forEach(category => {
  const categoryPath = path.join(logDir, category);
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
  }
});

// 注册颜色主题
winston.addColors(winstonConfig.colors);

// 自定义日志格式
const customFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.splat(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    if (typeof message === "object") {
      message = util.inspect(message, { depth: null, colors: true });
    }

    const metaStr =
      Object.keys(meta).length && !meta.splat
        ? `\nMETA: ${util.inspect(meta, { depth: null, colors: true })}`
        : "";

    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }),
);

// 基础日志格式
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
);

// 文件日志格式
const fileFormat = winston.format.combine(
  baseFormat,
  winston.format.splat(),
  winston.format.printf(info => {
    const { timestamp, level, message, stack, ...meta } = info;

    let formattedMessage = message;
    if (typeof message === "object") {
      formattedMessage = util.inspect(message, { depth: null });
    }

    const metaStr = Object.keys(meta).length
      ? `\nMETA: ${util.inspect(meta, { depth: null })}`
      : "";

    return `[${timestamp}] ${level.toUpperCase()}: ${formattedMessage}${metaStr}${
      stack ? `\nSTACK: ${stack}` : ""
    }`;
  }),
);

// 控制台日志格式
const consoleFormat = winston.format.combine(baseFormat, winston.format.colorize(), customFormat);

// 创建日志实例
const createLogger = category => {
  const transports = [
    new DailyRotateFile({
      dirname: path.join(logDir, category),
      filename: `${category}%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "20m",
      format: fileFormat,
    }),
  ];

  // 在开发环境下，只为 app 日志添加控制台输出
  if (process.env.NODE_ENV !== "production" && category === winstonConfig.categories.app) {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
      }),
    );
  }

  const logger = winston.createLogger({
    level: config.get("logger.level", "info"),
    levels: winstonConfig.levels,
    transports,
  });

  return logger;
};

// 创建不同类型的日志实例
const appLogger = createLogger(winstonConfig.categories.app);
const sqlLogger = createLogger(winstonConfig.categories.sql);
const errorLogger = createLogger(winstonConfig.categories.error);
module.exports = {
  appLogger,
  sqlLogger,
  errorLogger,
};
