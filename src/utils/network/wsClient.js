const WebSocket = require("ws");
const { appLogger } = require("@/core/log");

class WSClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectInterval: 3000, // 重连间隔时间
      maxRetries: 5, // 最大重试次数
      ...options,
    };
    this.ws = null;
    this.retryCount = 0;
    this.handlers = new Map();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.bindEvents();
    } catch (error) {
      appLogger.error("WebSocket connection error:", error);
      this.reconnect();
    }
  }

  bindEvents() {
    this.ws.on("open", () => {
      appLogger.info("WebSocket connected successfully");
      this.retryCount = 0;
    });

    this.ws.on("message", data => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(message);
      } catch (error) {
        appLogger.error("Failed to parse WebSocket message:", error);
      }
    });

    this.ws.on("close", () => {
      appLogger.info("WebSocket connection closed");
      this.reconnect();
    });

    this.ws.on("error", error => {
      appLogger.error("WebSocket error:", error);
    });
  }

  reconnect() {
    if (this.retryCount < this.options.maxRetries) {
      this.retryCount += 1;
      appLogger.info(`Attempting to reconnect... (${this.retryCount}/${this.options.maxRetries})`);
      setTimeout(() => this.connect(), this.options.reconnectInterval);
    } else {
      appLogger.error("Max reconnection attempts reached");
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      appLogger.warn("WebSocket is not connected");
    }
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }

  handleMessage(message) {
    const { type, data } = message;
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = WSClient;
