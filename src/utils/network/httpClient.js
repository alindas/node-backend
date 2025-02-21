const axios = require("axios");
const { appLogger } = require("@/core/log");

class HttpClient {
  constructor(config = {}) {
    this.client = axios.create({
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      ...config,
    });

    // 请求队列 用于取消重复请求
    this.pendingRequests = new Map();

    // 重试配置
    this.retryConfig = {
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      retryableStatuses: config.retryableStatuses || [408, 429, 500, 502, 503, 504],
    };

    this.setupInterceptors();
  }

  // 设置拦截器
  setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        const requestId = this.generateRequestId(config);

        if (config.cancelDuplicate && this.pendingRequests.has(requestId)) {
          throw new axios.Cancel("Duplicate request canceled");
        }

        const controller = new AbortController();
        config.signal = controller.signal;
        this.pendingRequests.set(requestId, controller);

        appLogger.info(`Sending ${config.method.toUpperCase()} request to ${config.url}`);
        return config;
      },
      error => {
        appLogger.error("Request error:", error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      response => {
        // 从请求队列中移除
        const requestId = this.generateRequestId(response.config);
        this.pendingRequests.delete(requestId);

        appLogger.info(`Received response from ${response.config.url}`);
        return response.data;
      },
      async error => {
        const { config } = error;

        // 从请求队列中移除
        if (config) {
          const requestId = this.generateRequestId(config);
          this.pendingRequests.delete(requestId);
        }

        // 处理重试逻辑
        if (this.shouldRetry(error)) {
          config.retryCount = config.retryCount || 0;

          if (config.retryCount < this.retryConfig.maxRetries) {
            config.retryCount += 1;
            await this.sleep(this.retryConfig.retryDelay);
            return this.client(config);
          }
        }

        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  // 生成请求唯一标识
  generateRequestId(config) {
    return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;
  }

  // 判断是否需要重试
  shouldRetry(error) {
    if (!error.config) return false;
    if (error.code === "ECONNABORTED") return true;
    return error.response && this.retryConfig.retryableStatuses.includes(error.response.status);
  }

  // 统一错误处理
  handleError(error) {
    if (error.response) {
      appLogger.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
        retryCount: error.config?.retryCount,
      });
    } else if (error.request) {
      appLogger.error("Request error: No response received", {
        url: error.config?.url,
        retryCount: error.config?.retryCount,
      });
    } else {
      appLogger.error("Error:", error.message);
    }
  }

  // 延时函数
  sleep(ms) {
    return new Promise(resolve => {
      const startTime = Date.now();
      let flag = true;
      while (flag) {
        if (Date.now() - startTime > ms) {
          flag = false;
        }
      }
      resolve();
    });
  }

  // 取消所有请求
  cancelAllRequests() {
    for (const controller of this.pendingRequests.values()) {
      controller.abort();
    }
    this.pendingRequests.clear();
  }

  // 取消指定请求
  cancelRequest(requestId) {
    const controller = this.pendingRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestId);
    }
  }

  async request(config) {
    return this.client.request({
      ...config,
      cancelDuplicate: config.cancelDuplicate ?? true,
    });
  }

  async get(url, config = {}) {
    return this.request({ ...config, method: "get", url });
  }

  async post(url, data = {}, config = {}) {
    return this.request({ ...config, method: "post", url, data });
  }

  async put(url, data = {}, config = {}) {
    return this.request({ ...config, method: "put", url, data });
  }

  async delete(url, config = {}) {
    return this.request({ ...config, method: "delete", url });
  }

  async patch(url, data = {}, config = {}) {
    return this.request({ ...config, method: "patch", url, data });
  }

  setHeader(name, value) {
    this.client.defaults.headers.common[name] = value;
  }

  setAuthToken(token) {
    this.setHeader("Authorization", `Bearer ${token}`);
  }
}

// 创建默认实例
const httpClient = new HttpClient();

module.exports = {
  HttpClient,
  httpClient,
};
