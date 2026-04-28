#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/scripts/lib/docker-build.sh"
IMAGE_NAME="${OPNEX_INSTALL_E2E_IMAGE:-opnex-install-e2e:local}"
INSTALL_URL="${OPNEX_INSTALL_URL:-https://opnex.bot/install.sh}"

OPENAI_API_KEY="${OPENAI_API_KEY:-}"
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
ANTHROPIC_API_TOKEN="${ANTHROPIC_API_TOKEN:-}"
OPNEX_E2E_MODELS="${OPNEX_E2E_MODELS:-}"

echo "==> Build image: $IMAGE_NAME"
docker_build_run install-e2e-build \
  -t "$IMAGE_NAME" \
  -f "$ROOT_DIR/scripts/docker/install-sh-e2e/Dockerfile" \
  "$ROOT_DIR/scripts/docker"

echo "==> Run E2E installer test"
docker run --rm \
  -e OPNEX_INSTALL_URL="$INSTALL_URL" \
  -e OPNEX_INSTALL_TAG="${OPNEX_INSTALL_TAG:-latest}" \
  -e OPNEX_E2E_MODELS="$OPNEX_E2E_MODELS" \
  -e OPNEX_INSTALL_E2E_PREVIOUS="${OPNEX_INSTALL_E2E_PREVIOUS:-}" \
  -e OPNEX_INSTALL_E2E_SKIP_PREVIOUS="${OPNEX_INSTALL_E2E_SKIP_PREVIOUS:-0}" \
  -e OPNEX_INSTALL_E2E_AGENT_TURN_TIMEOUT_SECONDS="${OPNEX_INSTALL_E2E_AGENT_TURN_TIMEOUT_SECONDS:-600}" \
  -e OPNEX_NO_ONBOARD=1 \
  -e OPENAI_API_KEY \
  -e ANTHROPIC_API_KEY \
  -e ANTHROPIC_API_TOKEN \
  "$IMAGE_NAME"
