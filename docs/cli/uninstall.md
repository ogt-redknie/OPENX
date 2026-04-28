---
summary: "CLI reference for `opnex uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "Uninstall"
---

# `opnex uninstall`

Uninstall the gateway service + local data (CLI remains).

Options:

- `--service`: remove the gateway service
- `--state`: remove state and config
- `--workspace`: remove workspace directories
- `--app`: remove the macOS app
- `--all`: remove service, state, workspace, and app
- `--yes`: skip confirmation prompts
- `--non-interactive`: disable prompts; requires `--yes`
- `--dry-run`: print actions without removing files

Examples:

```bash
opnex backup create
opnex uninstall
opnex uninstall --service --yes --non-interactive
opnex uninstall --state --workspace --yes --non-interactive
opnex uninstall --all --yes
opnex uninstall --dry-run
```

Notes:

- Run `opnex backup create` first if you want a restorable snapshot before removing state or workspaces.
- `--all` is shorthand for removing service, state, workspace, and app together.
- `--non-interactive` requires `--yes`.

## Related

- [CLI reference](/cli)
- [Uninstall](/install/uninstall)
