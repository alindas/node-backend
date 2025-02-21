const { Sequelize } = require("sequelize");
const config = require("./config");
const { errorLogger, appLogger } = require("../log");

class SequelizeClient {
  constructor() {
    this.sequelize = null;
    this.models = null;
  }

  connect() {
    if (this.sequelize) return this.sequelize;

    // 创建 Sequelize 实例
    this.sequelize = new Sequelize({
      ...config,
      database: config.database,
      username: config.username,
      password: config.password,
    });

    this._handleEvents();
    return this.sequelize;
  }

  _handleEvents() {
    this.sequelize
      .authenticate()
      .then(() => {
        appLogger.info("Database connected successfully");
        console.log(`Host: ${config.host}\nPort: ${config.port}\nDatabase: ${config.database}`);
      })
      .catch(err => {
        errorLogger.error("Database connection failed", err);
      });
  }

  getInstance() {
    if (!this.sequelize) {
      this.connect();
    }
    return this.sequelize;
  }

  async sync(force = false) {
    await this.sequelize.sync({ force });
  }

  async close() {
    if (this.sequelize) {
      await this.sequelize.close();
      this.sequelize = null;
    }
  }
}

module.exports = SequelizeClient;
