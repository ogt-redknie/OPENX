# ClawDock <!-- omit in toc -->

Stop typing `docker-compose` commands. Just type `clawdock-start`.

Inspired by Simon Willison's [Running OPNEX in Docker](https://til.simonwillison.net/llms/opnex-docker).

- [Quickstart](#quickstart)
- [Available Commands](#available-commands)
  - [Basic Operations](#basic-operations)
  - [Container Access](#container-access)
  - [Web UI \& Devices](#web-ui--devices)
  - [Setup \& Configuration](#setup--configuration)
  - [Maintenance](#maintenance)
  - [Utilities](#utilities)
- [Configuration \& Secrets](#configuration--secrets)
  - [Docker Files](#docker-files)
  - [Config Files](#config-files)
  - [Initial Setup](#initial-setup)
  - [How It Works in Docker](#how-it-works-in-docker)
  - [Env Precedence](#env-precedence)
- [Common Workflows](#common-workflows)
  - [Check Status and Logs](#check-status-and-logs)
  - [Set Up WhatsApp Bot](#set-up-whatsapp-bot)
  - [Troubleshooting Device Pairing](#troubleshooting-device-pairing)
  - [Fix Token Mismatch Issues](#fix-token-mismatch-issues)
  - [Permission Denied](#permission-denied)
- [Requirements](#requirements)
- [Development](#development)

## Quickstart

**Install:**

```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/opnex/opnex/main/scripts/clawdock/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
```

```bash
echo 'source ~/.clawdock/clawdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

Canonical docs page: https://docs.opnex.ai/install/clawdock

If you previously installed ClawDock from `scripts/shell-helpers/clawdock-helpers.sh`, rerun the install command above. The old raw GitHub path has been removed.

**See what you get:**

```bash
clawdock-help
```

On first command, ClawDock auto-detects your OPNEX directory:

- Checks common paths (`~/opnex`, `~/workspace/opnex`, etc.)
- If found, asks you to confirm
- Saves to `~/.clawdock/config`

**First time setup:**

```bash
clawdock-start
```

```bash
clawdock-fix-token
```

```bash
clawdock-dashboard
```

If you see "pairing required":

```bash
clawdock-devices
```

And approve the request for the specific device:

```bash
clawdock-approve <request-id>
```

## Available Commands

### Basic Operations

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `clawdock-start`   | Start the gateway               |
| `clawdock-stop`    | Stop the gateway                |
| `clawdock-restart` | Restart the gateway             |
| `clawdock-status`  | Check container status          |
| `clawdock-logs`    | View live logs (follows output) |

### Container Access

| Command                   | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `clawdock-shell`          | Interactive shell inside the gateway container |
| `clawdock-cli <command>`  | Run OPNEX CLI commands                      |
| `clawdock-exec <command>` | Execute arbitrary commands in the container    |

### Web UI & Devices

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `clawdock-dashboard`    | Open web UI in browser with authentication |
| `clawdock-devices`      | List device pairing requests               |
| `clawdock-approve <id>` | Approve a device pairing request           |

### Setup & Configuration

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `clawdock-fix-token` | Configure gateway authentication token (run once) |

### Maintenance

| Command            | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `clawdock-update`  | Pull latest, rebuild image, and restart (one command) |
| `clawdock-rebuild` | Rebuild the Docker image only                         |
| `clawdock-clean`   | Remove all containers and volumes (destructive!)      |

### Utilities

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `clawdock-health`      | Run gateway health check                  |
| `clawdock-token`       | Display the gateway authentication token  |
| `clawdock-cd`          | Jump to the OPNEX project directory    |
| `clawdock-config`      | Open the OPNEX config directory        |
| `clawdock-show-config` | Print config files with redacted values   |
| `clawdock-workspace`   | Open the workspace directory              |
| `clawdock-help`        | Show all available commands with examples |

## Configuration & Secrets

The Docker setup uses three config files on the host. The container never stores secrets — everything is bind-mounted from local files.

### Docker Files

| File                       | Purpose                                                                    |
| -------------------------- | -------------------------------------------------------------------------- |
| `Dockerfile`               | Builds the `opnex:local` image (Node 22, pnpm, non-root `node` user)    |
| `docker-compose.yml`       | Defines `opnex-gateway` and `opnex-cli` services, bind-mounts, ports |
| `docker-setup.sh`          | First-time setup — builds image, creates `.env` from `.env.example`        |
| `.env.example`             | Template for `<project>/.env` with all supported vars and docs             |
| `docker-compose.extra.yml` | Optional overrides — auto-loaded by ClawDock helpers if present            |

### Config Files

| File                        | Purpose                                          | Examples                                                            |
| --------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| `<project>/.env`            | **Docker infra** — image, ports, gateway token   | `OPNEX_GATEWAY_TOKEN`, `OPNEX_IMAGE`, `OPNEX_GATEWAY_PORT` |
| `~/.opnex/.env`          | **Secrets** — API keys and bot tokens            | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`         |
| `~/.opnex/opnex.json` | **Behavior config** — models, channels, policies | Model selection, WhatsApp allowlists, agent settings                |

**Do NOT** put API keys or bot tokens in `opnex.json`. Use `~/.opnex/.env` for all secrets.

### Initial Setup

`./docker-setup.sh` (in the project root) handles first-time Docker configuration:

- Builds the `opnex:local` image from `Dockerfile`
- Creates `<project>/.env` from `.env.example` with a generated gateway token
- Sets up `~/.opnex` directories if they don't exist

```bash
./docker-setup.sh
```

After setup, add your API keys:

```bash
vim ~/.opnex/.env
```

See `.env.example` for all supported keys.

The `Dockerfile` supports two optional build args:

- `OPNEX_DOCKER_APT_PACKAGES` — extra apt packages to install (e.g. `ffmpeg`)
- `OPNEX_INSTALL_BROWSER=1` — pre-install Chromium for browser automation (adds ~300MB, but skips the 60-90s Playwright install on each container start)

### How It Works in Docker

`docker-compose.yml` bind-mounts both config and workspace from the host:

```yaml
volumes:
  - ${OPNEX_CONFIG_DIR}:/home/node/.opnex
  - ${OPNEX_WORKSPACE_DIR}:/home/node/.opnex/workspace
  - opnex-plugin-runtime-deps:/var/lib/opnex/plugin-runtime-deps
```

This means:

- `~/.opnex/.env` is available inside the container at `/home/node/.opnex/.env` — OPNEX loads it automatically as the global env fallback
- `~/.opnex/opnex.json` is available at `/home/node/.opnex/opnex.json` — the gateway watches it and hot-reloads most changes
- Generated bundled plugin runtime deps and mirrors live in the `opnex-plugin-runtime-deps` Docker volume at `/var/lib/opnex/plugin-runtime-deps`, not in the host config bind mount
- No need to add API keys to `docker-compose.yml` or configure anything inside the container
- Keys survive `clawdock-update`, `clawdock-rebuild`, and `clawdock-clean` because they live on the host

The project `.env` feeds Docker Compose directly (gateway token, image name, ports). The `~/.opnex/.env` feeds the OPNEX process inside the container.

### Example `~/.opnex/.env`

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=123456:ABCDEF...
```

### Example `<project>/.env`

```bash
OPNEX_CONFIG_DIR=/Users/you/.opnex
OPNEX_WORKSPACE_DIR=/Users/you/.opnex/workspace
OPNEX_GATEWAY_PORT=18789
OPNEX_BRIDGE_PORT=18790
OPNEX_GATEWAY_BIND=lan
OPNEX_GATEWAY_TOKEN=<generated-by-docker-setup>
OPNEX_IMAGE=opnex:local
```

### Env Precedence

OPNEX loads env vars in this order (highest wins, never overrides existing):

1. **Process environment** — `docker-compose.yml` `environment:` block (gateway token, session keys)
2. **`.env` in CWD** — project root `.env` (Docker infra vars)
3. **`~/.opnex/.env`** — global secrets (API keys, bot tokens)
4. **`opnex.json` `env` block** — inline vars, applied only if still missing
5. **Shell env import** — optional login-shell scrape (`OPNEX_LOAD_SHELL_ENV=1`)

## Common Workflows

### Update OPNEX

> **Important:** `opnex update` does not work inside Docker.
> The container runs as a non-root user with a source-built image, so `npm i -g` fails with EACCES.
> Use `clawdock-update` instead — it pulls, rebuilds, and restarts from the host.

```bash
clawdock-update
```

This runs `git pull` → `docker compose build` → `docker compose down/up` in one step.

If you only want to rebuild without pulling:

```bash
clawdock-rebuild && clawdock-stop && clawdock-start
```

### Check Status and Logs

**Restart the gateway:**

```bash
clawdock-restart
```

**Check container status:**

```bash
clawdock-status
```

**View live logs:**

```bash
clawdock-logs
```

### Set Up WhatsApp Bot

**Shell into the container:**

```bash
clawdock-shell
```

**Inside the container, login to WhatsApp:**

```bash
opnex channels login --channel whatsapp --verbose
```

Scan the QR code with WhatsApp on your phone.

**Verify connection:**

```bash
opnex status
```

### Troubleshooting Device Pairing

**Check for pending pairing requests:**

```bash
clawdock-devices
```

**Copy the Request ID from the "Pending" table, then approve:**

```bash
clawdock-approve <request-id>
```

Then refresh your browser.

### Fix Token Mismatch Issues

If you see "gateway token mismatch" errors:

```bash
clawdock-fix-token
```

This will:

1. Read the token from your `.env` file
2. Configure it in the OPNEX config
3. Restart the gateway
4. Verify the configuration

### Permission Denied

**Ensure Docker is running and you have permission:**

```bash
docker ps
```

## Requirements

- Docker and Docker Compose installed
- Bash or Zsh shell
- OPNEX project (run `scripts/docker/setup.sh`)

## Development

**Test with fresh config (mimics first-time install):**

```bash
unset CLAWDOCK_DIR && rm -f ~/.clawdock/config && source scripts/clawdock/clawdock-helpers.sh
```

Then run any command to trigger auto-detect:

```bash
clawdock-start
```
