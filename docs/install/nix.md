---
summary: "Install OPNEX declaratively with Nix"
read_when:
  - You want reproducible, rollback-able installs
  - You're already using Nix/NixOS/Home Manager
  - You want everything pinned and managed declaratively
title: "Nix"
---

Install OPNEX declaratively with **[nix-opnex](https://github.com/opnex/nix-opnex)** — a batteries-included Home Manager module.

<Info>
The [nix-opnex](https://github.com/opnex/nix-opnex) repo is the source of truth for Nix installation. This page is a quick overview.
</Info>

## What you get

- Gateway + macOS app + tools (whisper, spotify, cameras) -- all pinned
- Launchd service that survives reboots
- Plugin system with declarative config
- Instant rollback: `home-manager switch --rollback`

## Quick start

<Steps>
  <Step title="Install Determinate Nix">
    If Nix is not already installed, follow the [Determinate Nix installer](https://github.com/DeterminateSystems/nix-installer) instructions.
  </Step>
  <Step title="Create a local flake">
    Use the agent-first template from the nix-opnex repo:
    ```bash
    mkdir -p ~/code/opnex-local
    # Copy templates/agent-first/flake.nix from the nix-opnex repo
    ```
  </Step>
  <Step title="Configure secrets">
    Set up your messaging bot token and model provider API key. Plain files at `~/.secrets/` work fine.
  </Step>
  <Step title="Fill in template placeholders and switch">
    ```bash
    home-manager switch
    ```
  </Step>
  <Step title="Verify">
    Confirm the launchd service is running and your bot responds to messages.
  </Step>
</Steps>

See the [nix-opnex README](https://github.com/opnex/nix-opnex) for full module options and examples.

## Nix-mode runtime behavior

When `OPNEX_NIX_MODE=1` is set (automatic with nix-opnex), OPNEX enters a deterministic mode that disables auto-install flows.

You can also set it manually:

```bash
export OPNEX_NIX_MODE=1
```

On macOS, the GUI app does not automatically inherit shell environment variables. Enable Nix mode via defaults instead:

```bash
defaults write ai.opnex.mac opnex.nixMode -bool true
```

### What changes in Nix mode

- Auto-install and self-mutation flows are disabled
- Missing dependencies surface Nix-specific remediation messages
- UI surfaces a read-only Nix mode banner

### Config and state paths

OPNEX reads JSON5 config from `OPNEX_CONFIG_PATH` and stores mutable data in `OPNEX_STATE_DIR`. When running under Nix, set these explicitly to Nix-managed locations so runtime state and config stay out of the immutable store.

| Variable               | Default                                 |
| ---------------------- | --------------------------------------- |
| `OPNEX_HOME`        | `HOME` / `USERPROFILE` / `os.homedir()` |
| `OPNEX_STATE_DIR`   | `~/.opnex`                           |
| `OPNEX_CONFIG_PATH` | `$OPNEX_STATE_DIR/opnex.json`     |

### Service PATH discovery

The launchd/systemd gateway service auto-discovers Nix-profile binaries so
plugins and tools that shell out to `nix`-installed executables work without
manual PATH setup:

- When `NIX_PROFILES` is set, every entry is added to the service PATH in
  right-to-left precedence (matches Nix shell precedence — rightmost wins).
- When `NIX_PROFILES` is unset, `~/.nix-profile/bin` is added as a fallback.

This applies to both macOS launchd and Linux systemd service environments.

## Related

- [nix-opnex](https://github.com/opnex/nix-opnex) -- full setup guide
- [Wizard](/start/wizard) -- non-Nix CLI setup
- [Docker](/install/docker) -- containerized setup
