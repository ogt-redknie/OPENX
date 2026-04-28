---
summary: "CLI reference for `opnex tasks` (background task ledger and Task Flow state)"
read_when:
  - You want to inspect, audit, or cancel background task records
  - You are documenting Task Flow commands under `opnex tasks flow`
title: "`opnex tasks`"
---

Inspect durable background tasks and Task Flow state. With no subcommand,
`opnex tasks` is equivalent to `opnex tasks list`.

See [Background Tasks](/automation/tasks) for the lifecycle and delivery model.

## Usage

```bash
opnex tasks
opnex tasks list
opnex tasks list --runtime acp
opnex tasks list --status running
opnex tasks show <lookup>
opnex tasks notify <lookup> state_changes
opnex tasks cancel <lookup>
opnex tasks audit
opnex tasks maintenance
opnex tasks maintenance --apply
opnex tasks flow list
opnex tasks flow show <lookup>
opnex tasks flow cancel <lookup>
```

## Root Options

- `--json`: output JSON.
- `--runtime <name>`: filter by kind: `subagent`, `acp`, `cron`, or `cli`.
- `--status <name>`: filter by status: `queued`, `running`, `succeeded`, `failed`, `timed_out`, `cancelled`, or `lost`.

## Subcommands

### `list`

```bash
opnex tasks list [--runtime <name>] [--status <name>] [--json]
```

Lists tracked background tasks newest first.

### `show`

```bash
opnex tasks show <lookup> [--json]
```

Shows one task by task ID, run ID, or session key.

### `notify`

```bash
opnex tasks notify <lookup> <done_only|state_changes|silent>
```

Changes the notification policy for a running task.

### `cancel`

```bash
opnex tasks cancel <lookup>
```

Cancels a running background task.

### `audit`

```bash
opnex tasks audit [--severity <warn|error>] [--code <name>] [--limit <n>] [--json]
```

Surfaces stale, lost, delivery-failed, or otherwise inconsistent task and Task Flow records. Lost tasks retained until `cleanupAfter` are warnings; expired or unstamped lost tasks are errors.

### `maintenance`

```bash
opnex tasks maintenance [--apply] [--json]
```

Previews or applies task and Task Flow reconciliation, cleanup stamping, and pruning.
For cron tasks, reconciliation uses persisted run logs/job state before marking an
old active task `lost`, so completed cron runs do not become false audit errors
just because the in-memory Gateway runtime state is gone. Offline CLI audit is
not authoritative for the Gateway's process-local cron active-job set.

### `flow`

```bash
opnex tasks flow list [--status <name>] [--json]
opnex tasks flow show <lookup> [--json]
opnex tasks flow cancel <lookup>
```

Inspects or cancels durable Task Flow state under the task ledger.

## Related

- [CLI reference](/cli)
- [Background tasks](/automation/tasks)
