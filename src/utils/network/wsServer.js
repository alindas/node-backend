const WebSocket = require("ws");
const { appLogger } = require("@/core/log");

class WSServer {
  constructor(options = {}) {
    this.options = {
      port: 8080,
      path: "/ws",
      pingInterval: 30000,
      pingTimeout: 5000,
      maxPayload: 10 * 1024 * 1024,
      ...options,
    };
    this.wss = null;
    this.clients = new Map();
    this.handlers = new Map();
    this.middlewares = [];
    this.messageQueue = new Map();
    this.heartbeatInterval = null;
  }

  use(middleware) {
    if (typeof middleware !== "function") {
      throw new Error("Middleware must be a function");
    }
    this.middlewares.push(middleware);
    return this;
  }

  start() {
    this.wss = new WebSocket.Server({
      ...this.options,
      clientTracking: true,
    });
    this.bindEvents();
    this.startHeartbeat();
    appLogger.info(`WebSocket server started on port ${this.options.port}`);
  }

  bindEvents() {
    this.wss.on("connection", (ws, req) => {
      const clientId = this.generateClientId();
      const clientInfo = {
        id: clientId,
        ws,
        isAlive: true,
        lastPing: Date.now(),
        ip: req.socket.remoteAddress,
        connectTime: new Date(),
      };

      this.clients.set(clientId, clientInfo);
      appLogger.info(`Client connected: ${clientId} from ${clientInfo.ip}`);

      ws.maxPayload = this.options.maxPayload;

      ws.on("pong", () => {
        clientInfo.isAlive = true;
        clientInfo.lastPing = Date.now();
      });

      ws.on("message", async message => {
        try {
          const data = JSON.parse(message);

          const ctx = { clientId, data, ws: clientInfo };
          for (const middleware of this.middlewares) {
            await middleware(ctx);
            if (ctx.ended) return;
          }

          await this.handleMessage(clientId, data);

          this.processMessageQueue(clientId);
        } catch (error) {
          appLogger.error("Message handling error:", error);
          this.sendError(clientId, {
            code: "MESSAGE_ERROR",
            message: "Failed to process message",
          });
        }
      });

      ws.on("close", () => {
        this.handleClientDisconnect(clientId);
      });

      ws.on("error", error => {
        appLogger.error(`Client error: ${clientId}`, error);
        this.handleClientError(clientId, error);
      });
    });

    this.wss.on("error", error => {
      appLogger.error("WebSocket server error:", error);
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      for (const client of this.clients.values()) {
        if (!client.isAlive) {
          appLogger.warn(`Client ${client.id} heartbeat timeout`);
          client.ws.terminate();
          continue;
        }
        client.isAlive = false;
        client.ws.ping();
      }
      return undefined;
    }, this.options.pingInterval);
  }

  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      appLogger.info(`Client disconnected: ${clientId}`);
      this.clients.delete(clientId);
      const handlers = this.handlers.get("disconnect");
      if (handlers) {
        handlers.forEach(handler => handler(clientId));
      }
    }
  }

  handleClientError(clientId, error) {
    const handlers = this.handlers.get("error");
    if (handlers) {
      handlers.forEach(handler => handler(clientId, error));
    }
  }

  addToMessageQueue(clientId, message) {
    if (!this.messageQueue.has(clientId)) {
      this.messageQueue.set(clientId, []);
    }
    this.messageQueue.get(clientId).push(message);
  }

  processMessageQueue(clientId) {
    const queue = this.messageQueue.get(clientId);
    if (!queue || queue.length === 0) return;

    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) return;

    while (queue.length > 0) {
      const message = queue.shift();
      this.sendTo(clientId, message);
    }
  }

  sendError(clientId, error) {
    this.sendTo(clientId, {
      type: "error",
      data: error,
    });
  }

  getClientInfo(clientId) {
    return this.clients.get(clientId);
  }

  getConnectionCount() {
    return this.clients.size;
  }

  close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    for (const client of this.clients.values()) {
      try {
        client.ws.close();
      } catch (err) {
        appLogger.error(`Error closing client connection: ${client.id}`, err);
      }
    }

    if (this.wss) {
      this.wss.close(() => {
        appLogger.info("WebSocket server closed");
        return undefined;
      });
    }
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  }

  sendTo(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }

  handleMessage(clientId, message) {
    const { type, data } = message;
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(clientId, data));
    }
  }
}

module.exports = WSServer;
