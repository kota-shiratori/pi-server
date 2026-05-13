#!/usr/bin/env bash
set -euo pipefail

# 色付け
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PI_HOST="${PI_HOST:-pi}"
PI_PATH="${PI_PATH:-pi-server}"

echo -e "${YELLOW}▶ Building...${NC}"
npm run build

echo -e "${YELLOW}▶ Syncing to ${PI_HOST}:${PI_PATH}/...${NC}"
rsync -av --delete \
  --exclude=node_modules \
  --exclude=data \
  --exclude=src \
  --exclude=.git \
  --exclude=scripts \
  ./ "${PI_HOST}:${PI_PATH}/"

echo -e "${YELLOW}▶ Installing prod deps on Pi...${NC}"
ssh "${PI_HOST}" "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\" && cd ${PI_PATH} && npm ci --omit=dev"

echo -e "${YELLOW}▶ Restarting service...${NC}"
ssh "${PI_HOST}" "sudo systemctl restart pi-server"

echo -e "${YELLOW}▶ Checking status...${NC}"
ssh "${PI_HOST}" "sudo systemctl is-active pi-server" && \
  echo -e "${GREEN}✓ Deploy complete${NC}" || \
  echo -e "${RED}✗ Service is not active!${NC}"
