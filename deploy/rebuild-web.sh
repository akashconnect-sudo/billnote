#!/usr/bin/env bash
# Hang-safe web rebuild for t3.micro. Run on EC2:
#   cd /opt/billnote && sudo bash deploy/rebuild-web.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="${ROOT}/deploy-web-build.log"
COMPOSE=(docker compose --env-file .env -f deploy/docker-compose.prod.yml)

echo "==> Ensuring 2G swap (stops OOM hangs during next build)"
if ! swapon --show | grep -q .; then
  if [[ ! -f /swapfile ]]; then
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile || true
fi
swapon --show || true
free -h

echo "==> Pulling latest"
git pull origin main
git log -1 --oneline

echo "==> Stopping web briefly to free RAM for build"
"${COMPOSE[@]}" stop web || true

echo "==> Building web (log: ${LOG})"
# BuildKit can OOM hard on 1GB RAM — keep concurrency low
export DOCKER_BUILDKIT=1
export BUILDKIT_STEP_LOG_MAX_SIZE=10485760
set +e
"${COMPOSE[@]}" build web >"${LOG}" 2>&1
CODE=$?
set -e

if [[ "${CODE}" -ne 0 ]]; then
  echo "BUILD FAILED (exit ${CODE}). Last 80 log lines:"
  tail -n 80 "${LOG}"
  "${COMPOSE[@]}" start web || true
  exit "${CODE}"
fi

echo "==> Recreating web + caddy"
"${COMPOSE[@]}" up -d --force-recreate web caddy
"${COMPOSE[@]}" ps

echo "==> Done. Open https://notebill.duckdns.org/signup"
echo "    You should see button: Send email OTP"
echo "Full log: ${LOG}"
