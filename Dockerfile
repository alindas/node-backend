# 基础镜像
FROM node:18.20.5-alpine3.21

# 设置工作目录
WORKDIR /app

# 创建非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 复制源代码
COPY . .

# 安装必要的系统依赖
RUN apk add --no-cache tzdata

# 设置时区为 UTC+8
ENV TZ=Asia/Shanghai

# 安装项目依赖
RUN npm config set registry https://registry.npmmirror.com
# 安装全局依赖
RUN npm install -g cross-env pm2
# 安装项目依赖，跳过 husky 安装
RUN HUSKY=0 npm install --no-package-lock

# 构建应用
RUN npm run build

RUN rm -rf src && mv dist src

# 创建日志目录并设置权限
RUN mkdir -p logs/pm2 && \
    chown -R appuser:appgroup /app && \
    chmod -R 755 /app

# 设置 PM2 相关环境变量
ENV PM2_HOME=/app/.pm2

# 设置环境变量
ENV NODE_ENV=production

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 5001

# 修改启动命令
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
