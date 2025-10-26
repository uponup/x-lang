#!/bin/bash

# 下载脚本：从远程服务器同步到本地
# 使用 rsync 进行增量同步（比 scp 快很多）

# 配置
REMOTE_USER="admin"
REMOTE_HOST="47.92.74.173"
REMOTE_PATH="/home/admin/x-lang"
LOCAL_PATH="."

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📥 任务开始（拉取）...${NC}"
echo ""

# 使用 rsync 进行同步（从远程到本地）
rsync -avz --progress \
  --exclude 'node_modules/' \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude '.env' \
  --exclude '.vscode/' \
  --exclude 'target/' \
  --exclude 'dist/' \
  --exclude 'build/' \
  ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/ ${LOCAL_PATH}/

# 检查同步结果
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 同步成功！${NC}"
else
    echo ""
    echo -e "${RED}❌ 同步失败！${NC}"
    exit 1
fi

