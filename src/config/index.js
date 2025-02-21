const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

class Config {
  constructor() {
    this.config = {};
    this.loadConfig();
  }

  /**
   * 加载配置文件
   */
  loadConfig() {
    // 加载默认配置
    this.config = this.loadYamlFile("default.yml");

    // 加载环境特定配置
    const env = process.env.NODE_ENV || "development";
    const envConfig = this.loadYamlFile(`${env}.yml`, true);
    if (envConfig) {
      this.config = this.mergeConfig(this.config, envConfig);
    }
  }

  /**
   * 合并配置
   */
  mergeConfig(defaultConfig, envConfig) {
    const merged = { ...defaultConfig };

    Object.keys(envConfig).forEach(key => {
      if (typeof envConfig[key] === "object" && envConfig[key] !== null) {
        merged[key] = this.mergeConfig(merged[key] || {}, envConfig[key]);
      } else {
        merged[key] = envConfig[key];
      }
    });

    return merged;
  }

  /**
   * 获取配置值
   * @param {string} path 配置路径，如 'server.port'
   * @param {*} defaultValue 默认值
   */
  get(configPath, defaultValue = undefined) {
    return configPath.split(".").reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : defaultValue;
    }, this.config);
  }

  /**
   * 获取完整配置
   */
  getConfig() {
    return this.config;
  }

  /**
   * 加载 YAML 文件
   * @param {string} filename 文件名
   * @param {boolean} optional 是否可选
   */
  loadYamlFile(filename, optional = false) {
    const yamlPath = path.join(__dirname, "../../env");
    const filePath = path.join(yamlPath, filename);
    if (!fs.existsSync(filePath)) {
      if (optional) {
        return null;
      }
      throw new Error(`Configuration file ${filename} not found`);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContent);
  }
}

// 导出单例
module.exports = new Config();
