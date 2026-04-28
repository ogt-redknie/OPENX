#!/usr/bin/env bash
set -euo pipefail

cd /repo

export OPNEX_STATE_DIR="/tmp/opnex-test"
export OPNEX_CONFIG_PATH="${OPNEX_STATE_DIR}/opnex.json"

echo "==> Build"
if ! pnpm build >/tmp/opnex-cleanup-build.log 2>&1; then
  cat /tmp/opnex-cleanup-build.log
  exit 1
fi

echo "==> Seed state"
mkdir -p "${OPNEX_STATE_DIR}/credentials"
mkdir -p "${OPNEX_STATE_DIR}/agents/main/sessions"
echo '{}' >"${OPNEX_CONFIG_PATH}"
echo 'creds' >"${OPNEX_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${OPNEX_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
if ! pnpm opnex reset --scope config+creds+sessions --yes --non-interactive >/tmp/opnex-cleanup-reset.log 2>&1; then
  cat /tmp/opnex-cleanup-reset.log
  exit 1
fi

test ! -f "${OPNEX_CONFIG_PATH}"
test ! -d "${OPNEX_STATE_DIR}/credentials"
test ! -d "${OPNEX_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${OPNEX_STATE_DIR}/credentials"
echo '{}' >"${OPNEX_CONFIG_PATH}"

echo "==> Uninstall (state only)"
if ! pnpm opnex uninstall --state --yes --non-interactive >/tmp/opnex-cleanup-uninstall.log 2>&1; then
  cat /tmp/opnex-cleanup-uninstall.log
  exit 1
fi

test ! -d "${OPNEX_STATE_DIR}"

echo "OK"
