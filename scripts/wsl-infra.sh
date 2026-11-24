#!/usr/bin/env bash
set -euo pipefail

sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y redis-server postgresql postgresql-contrib

sudo service redis-server start || true
sudo service postgresql start || true

redis-cli ping

sudo -u postgres psql -c "SELECT version();"

if ! sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='billnote'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER billnote WITH PASSWORD 'billnote' SUPERUSER CREATEDB;"
fi

if ! sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='billnote_control'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE billnote_control OWNER billnote;"
fi

# Listen on all interfaces so Windows localhost can reach WSL Postgres/Redis if needed.
# Default WSL redis binds 127.0.0.1 inside WSL; Windows reaches it via mirrored networking or port proxy.
redis-cli CONFIG SET protected-mode no || true

echo READY
redis-cli INFO server | head -n 5
sudo -u postgres psql -c "\l billnote_control"
