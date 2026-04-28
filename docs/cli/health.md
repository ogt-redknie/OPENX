---
summary: "CLI reference for `opnex health` (gateway health snapshot via RPC)"
read_when:
  - You want to quickly check the running Gateway’s health
title: "Health"
---

# `opnex health`

Fetch health from the running Gateway.

Options:

- `--json`: machine-readable output
- `--timeout <ms>`: connection timeout in milliseconds (default `10000`)
- `--verbose`: verbose logging
- `--debug`: alias for `--verbose`

Examples:

```bash
opnex health
opnex health --json
opnex health --timeout 2500
opnex health --verbose
opnex health --debug
```

Notes:

- Default `opnex health` asks the running gateway for its health snapshot. When the
  gateway already has a fresh cached snapshot, it can return that cached payload and
  refresh in the background.
- `--verbose` forces a live probe, prints gateway connection details, and expands the
  human-readable output across all configured accounts and agents.
- Output includes per-agent session stores when multiple agents are configured.

## Related

- [CLI reference](/cli)
- [Gateway health](/gateway/health)
