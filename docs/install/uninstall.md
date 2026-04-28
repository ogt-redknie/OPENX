---
summary: "Uninstall OPNEX completely (CLI, service, state, workspace)"
read_when:
  - You want to remove OPNEX from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

Two paths:

- **Easy path** if `opnex` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
opnex uninstall
```

Non-interactive (automation / npx):

```bash
opnex uninstall --all --yes --non-interactive
npx -y opnex uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
opnex gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
opnex gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${OPNEX_STATE_DIR:-$HOME/.opnex}"
```

If you set `OPNEX_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.opnex/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g opnex
pnpm remove -g opnex
bun remove -g opnex
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/OPNEX.app
```

Notes:

- If you used profiles (`--profile` / `OPNEX_PROFILE`), repeat step 3 for each state dir (defaults are `~/.opnex-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `opnex` is missing.

### macOS (launchd)

Default label is `ai.opnex.gateway` (or `ai.opnex.<profile>`; legacy `com.opnex.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.opnex.gateway
rm -f ~/Library/LaunchAgents/ai.opnex.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.opnex.<profile>`. Remove any legacy `com.opnex.*` plists if present.

### Linux (systemd user unit)

Default unit name is `opnex-gateway.service` (or `opnex-gateway-<profile>.service`):

```bash
systemctl --user disable --now opnex-gateway.service
rm -f ~/.config/systemd/user/opnex-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `OPNEX Gateway` (or `OPNEX Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "OPNEX Gateway"
Remove-Item -Force "$env:USERPROFILE\.opnex\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.opnex-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://opnex.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g opnex@latest`.
Remove it with `npm rm -g opnex` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `opnex ...` / `bun run opnex ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.

## Related

- [Install overview](/install)
- [Migration guide](/install/migrating)
