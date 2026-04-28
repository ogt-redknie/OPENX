---
summary: "CLI reference for `opnex skills` (search/install/update/list/info/check)"
read_when:
  - You want to see which skills are available and ready to run
  - You want to search, install, or update skills from ClawHub
  - You want to debug missing binaries/env/config for skills
title: "Skills"
---

# `opnex skills`

Inspect local skills and install/update skills from ClawHub.

Related:

- Skills system: [Skills](/tools/skills)
- Skills config: [Skills config](/tools/skills-config)
- ClawHub installs: [ClawHub](/tools/clawhub)

## Commands

```bash
opnex skills search "calendar"
opnex skills search --limit 20 --json
opnex skills install <slug>
opnex skills install <slug> --version <version>
opnex skills install <slug> --force
opnex skills install <slug> --agent <id>
opnex skills update <slug>
opnex skills update --all
opnex skills update --all --agent <id>
opnex skills list
opnex skills list --eligible
opnex skills list --json
opnex skills list --verbose
opnex skills list --agent <id>
opnex skills info <name>
opnex skills info <name> --json
opnex skills info <name> --agent <id>
opnex skills check
opnex skills check --json
opnex skills check --agent <id>
```

`search`/`install`/`update` use ClawHub directly and install into the active
workspace `skills/` directory. `list`/`info`/`check` still inspect the local
skills visible to the current workspace and config. Workspace-backed commands
resolve the target workspace from `--agent <id>`, then the current working
directory when it is inside a configured agent workspace, then the default
agent.

This CLI `install` command downloads skill folders from ClawHub. Gateway-backed
skill dependency installs triggered from onboarding or Skills settings use the
separate `skills.install` request path instead.

Notes:

- `search [query...]` accepts an optional query; omit it to browse the default
  ClawHub search feed.
- `search --limit <n>` caps returned results.
- `install --force` overwrites an existing workspace skill folder for the same
  slug.
- `--agent <id>` targets one configured agent workspace and overrides current
  working directory inference.
- `update --all` only updates tracked ClawHub installs in the active workspace.
- `list` is the default action when no subcommand is provided.
- `list`, `info`, and `check` write their rendered output to stdout. With
  `--json`, that means the machine-readable payload stays on stdout for pipes
  and scripts.

## Related

- [CLI reference](/cli)
- [Skills](/tools/skills)
