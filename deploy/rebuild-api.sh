#!/usr/bin/env bash
# Hang-safe API rebuild for t3.micro. Run on EC2:
#   cd /opt/billnote && sudo bash deploy/rebuild-api.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="${ROOT}/deploy-api-build.log"
COMPOSE=(docker compose --env-file .env -f deploy/docker-compose.prod.yml)

echo "==> Ensuring 2G swap"
if ! swapon --show | grep -q .; then
  if [[ ! -f /swapfile ]]; then
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile || true
fi
free -h

echo "==> Pulling latest"
git pull origin main
git log -1 --oneline

echo "==> Building api (log: ${LOG})"
export DOCKER_BUILDKIT=1
set +e
"${COMPOSE[@]}" build api >"${LOG}" 2>&1
CODE=$?
set -e

if [[ "${CODE}" -ne 0 ]]; then
  echo "BUILD FAILED (exit ${CODE}). Last 80 log lines:"
  tail -n 80 "${LOG}"
  exit "${CODE}"
fi

echo "==> Recreating api + caddy"
"${COMPOSE[@]}" up -d --force-recreate api caddy
"${COMPOSE[@]}" ps
echo "==> Health:"
curl -sS "https://${DUCKDNS_DOMAIN:-notebill}.duckdns.org/health/ready" || true
echo
echo "Full log: ${LOG}"
