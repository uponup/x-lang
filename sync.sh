#!/bin/bash

# 双向同步脚本：上传或下载
# 使用 rsync 进行增量同步

# 配置
REMOTE_USER="admin"
REMOTE_HOST="47.92.74.173"
REMOTE_PATH="/home/admin/x-lang"
LOCAL_PATH="."

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 显示菜单
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       X-Lang 项目同步工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "请选择操作："
echo "  1) 📤 上传到远程服务器 (本地 → 远程)"
echo "  2) 📥 从远程下载到本地 (远程 → 本地)"
echo "  3) 🔄 双向同步（保留最新）"
echo "  4) 👀 预览变化（不实际同步）"
echo "  0) 退出"
echo ""
read -p "请输入选项 [0-4]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}📤 开始上传到远程...${NC}"
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
          --delete \
          ${LOCAL_PATH}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 上传成功！${NC}"
        else
            echo -e "${RED}❌ 上传失败！${NC}"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo -e "${YELLOW}📥 开始从远程下载...${NC}"
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
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 下载成功！${NC}"
        else
            echo -e "${RED}❌ 下载失败！${NC}"
            exit 1
        fi
        ;;
    
    3)
        echo ""
        echo -e "${YELLOW}🔄 开始双向同步（保留最新文件）...${NC}"
        echo -e "${YELLOW}⚠️  警告：这会覆盖旧文件！${NC}"
        read -p "确认继续？[y/N]: " confirm
        
        if [[ $confirm == [yY] ]]; then
            rsync -avz --progress --update \
              --exclude 'node_modules/' \
              --exclude '.git/' \
              --exclude '.DS_Store' \
              --exclude '*.log' \
              --exclude '.env' \
              --exclude '.vscode/' \
              --exclude 'target/' \
              --exclude 'dist/' \
              --exclude 'build/' \
              ${LOCAL_PATH}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
            
            rsync -avz --progress --update \
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
            
            echo -e "${GREEN}✅ 双向同步完成！${NC}"
        else
            echo -e "${YELLOW}❌ 已取消${NC}"
        fi
        ;;
    
    4)
        echo ""
        echo -e "${YELLOW}👀 预览本地到远程的变化：${NC}"
        rsync -avz --dry-run --itemize-changes \
          --exclude 'node_modules/' \
          --exclude '.git/' \
          --exclude '.DS_Store' \
          --exclude '*.log' \
          --exclude '.env' \
          --exclude '.vscode/' \
          --exclude 'target/' \
          --exclude 'dist/' \
          --exclude 'build/' \
          ${LOCAL_PATH}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
        
        echo ""
        echo -e "${YELLOW}👀 预览远程到本地的变化：${NC}"
        rsync -avz --dry-run --itemize-changes \
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
        ;;
    
    0)
        echo -e "${YELLOW}👋 再见！${NC}"
        exit 0
        ;;
    
    *)
        echo -e "${RED}❌ 无效选项！${NC}"
        exit 1
        ;;
esac

