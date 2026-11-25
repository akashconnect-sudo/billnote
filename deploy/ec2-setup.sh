#!/usr/bin/env bash
set -euo pipefail

# Run on a fresh Ubuntu 24.04 EC2 in ap-south-1 after cloning the repo.

if [[ "${EUID}" -ne 0 ]]; then
  echo "Re-run with sudo"
  exit 1
fi

apt-get update -y
apt-get install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
usermod -aG docker ubuntu || true

echo "Docker installed. Copy .env, set DUCKDNS_TOKEN + JWT secrets, then:"
echo "  cd /opt/billnote && docker compose -f deploy/docker-compose.prod.yml --profile duckdns up -d --build"
