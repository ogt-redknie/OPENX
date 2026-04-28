#!/usr/bin/env bash
# Runs a mocked OpenAI image-generation auth smoke inside Docker against the
# package-installed functional E2E image.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$ROOT_DIR/scripts/lib/docker-e2e-image.sh"

IMAGE_NAME="$(docker_e2e_resolve_image "opnex-openai-image-auth-e2e" OPNEX_OPENAI_IMAGE_AUTH_E2E_IMAGE)"
SKIP_BUILD="${OPNEX_OPENAI_IMAGE_AUTH_E2E_SKIP_BUILD:-0}"

docker_e2e_build_or_reuse "$IMAGE_NAME" openai-image-auth "$ROOT_DIR/scripts/e2e/Dockerfile" "$ROOT_DIR" "" "$SKIP_BUILD"
docker_e2e_harness_mount_args

echo "Running OpenAI image auth Docker E2E..."
# Harness files are mounted read-only; the app under test comes from /app/dist.
run_logged openai-image-auth docker run --rm \
  -e "OPENAI_API_KEY=sk-opnex-image-auth-e2e" \
  -e "OPNEX_QA_ALLOW_LOCAL_IMAGE_PROVIDER=1" \
  "${DOCKER_E2E_HARNESS_ARGS[@]}" \
  -i "$IMAGE_NAME" bash -lc '
set -euo pipefail
export HOME="$(mktemp -d "/tmp/opnex-openai-image-auth.XXXXXX")"
export OPNEX_STATE_DIR="$HOME/.opnex"
export OPNEX_SKIP_CHANNELS=1
export OPNEX_SKIP_GMAIL_WATCHER=1
export OPNEX_SKIP_CRON=1
export OPNEX_SKIP_CANVAS_HOST=1

tsx scripts/e2e/openai-image-auth-docker-client.ts
'
