#!/bin/bash

# 定义变量
IMAGE_NAME="your-app-name"
CONTAINER_NAME="your-app-container"
VERSION="1.0.0"

# 颜色输出
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 在运行容器之前加载环境变量
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# 构建 Docker 镜像
echo -e "${GREEN}开始构建 Docker 镜像...${NC}"
docker build -t ${IMAGE_NAME}:${VERSION} .

# 检查是否存在同名容器，如果存在则停止并删除
if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
    echo -e "${GREEN}停止并删除已存在的容器...${NC}"
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# 运行新容器
echo -e "${GREEN}启动新容器...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p 5001:5001 \
    -e DB_HOST="${DB_HOST}" \
    -e DB_PORT="${DB_PORT}" \
    -e DB_USERNAME="${DB_USERNAME}" \
    -e DB_PASSWORD="${DB_PASSWORD}" \
    -e DB_DATABASE="${DB_DATABASE}" \
    -e REDIS_HOST="${REDIS_HOST}" \
    -e REDIS_PORT="${REDIS_PORT}" \
    -e REDIS_PASSWORD="${REDIS_PASSWORD}" \
    -e REDIS_DB="${REDIS_DB}" \
    --restart unless-stopped \
    ${IMAGE_NAME}:${VERSION}

# 检查容器是否成功运行
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo -e "${GREEN}容器已成功启动！${NC}"
    echo -e "${GREEN}容器日志：${NC}"
    docker logs ${CONTAINER_NAME}
else
    echo "容器启动失败，请检查日志"
    exit 1
fi 
