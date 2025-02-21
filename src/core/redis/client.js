const Redis = require("ioredis");
const config = require("./config");
const appConfig = require("../../config");
const { appLogger } = require("../log");

class RedisClient {
  constructor() {
    this.client = null;
    this.prefix = `${appConfig.get("app.name")}:`;
  }

  connect() {
    if (this.client) return this.client;

    this.client = new Redis({
      ...config,
      keyPrefix: this.prefix,
    });

    this._handleEvents();
    return this.client;
  }

  _handleEvents() {
    this.client
      .on("connect", () => appLogger.info("Redis connected successfully"))
      .on("error", err => appLogger.error("Redis connection error:", err))
      .on("close", () => appLogger.info("Redis connection closed"));
  }

  async set(key, value, expiration = null) {
    if (expiration) {
      await this.client.set(key, JSON.stringify(value), "EX", expiration);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async get(key) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key) {
    await this.client.del(key);
  }

  async setex(key, seconds, value) {
    await this.client.setex(key, seconds, JSON.stringify(value));
  }

  async exists(key) {
    return (await this.client.exists(key)) === 1;
  }

  getClient() {
    return this.client || this.connect();
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

module.exports = RedisClient;
