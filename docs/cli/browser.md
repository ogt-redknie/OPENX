---
summary: "CLI reference for `opnex browser` (lifecycle, profiles, tabs, actions, state, and debugging)"
read_when:
  - You use `opnex browser` and want examples for common tasks
  - You want to control a browser running on another machine via a node host
  - You want to attach to your local signed-in Chrome via Chrome MCP
title: "Browser"
---

# `opnex browser`

Manage OPNEX's browser control surface and run browser actions (lifecycle, profiles, tabs, snapshots, screenshots, navigation, input, state emulation, and debugging).

Related:

- Browser tool + API: [Browser tool](/tools/browser)

## Common flags

- `--url <gatewayWsUrl>`: Gateway WebSocket URL (defaults to config).
- `--token <token>`: Gateway token (if required).
- `--timeout <ms>`: request timeout (ms).
- `--expect-final`: wait for a final Gateway response.
- `--browser-profile <name>`: choose a browser profile (default from config).
- `--json`: machine-readable output (where supported).

## Quick start (local)

```bash
opnex browser profiles
opnex browser --browser-profile opnex start
opnex browser --browser-profile opnex open https://example.com
opnex browser --browser-profile opnex snapshot
```

Agents can run the same readiness check with `browser({ action: "doctor" })`.

## Quick troubleshooting

If `start` fails with `not reachable after start`, troubleshoot CDP readiness first. If `start` and `tabs` succeed but `open` or `navigate` fails, the browser control plane is healthy and the failure is usually navigation SSRF policy.

Minimal sequence:

```bash
opnex browser --browser-profile opnex doctor
opnex browser --browser-profile opnex start
opnex browser --browser-profile opnex tabs
opnex browser --browser-profile opnex open https://example.com
```

Detailed guidance: [Browser troubleshooting](/tools/browser#cdp-startup-failure-vs-navigation-ssrf-block)

## Lifecycle

```bash
opnex browser status
opnex browser doctor
opnex browser doctor --deep
opnex browser start
opnex browser start --headless
opnex browser stop
opnex browser --browser-profile opnex reset-profile
```

Notes:

- `doctor --deep` adds a live snapshot probe. It is useful when basic CDP
  readiness is green but you want proof that the current tab can be inspected.
- For `attachOnly` and remote CDP profiles, `opnex browser stop` closes the
  active control session and clears temporary emulation overrides even when
  OPNEX did not launch the browser process itself.
- For local managed profiles, `opnex browser stop` stops the spawned browser
  process.
- `opnex browser start --headless` applies only to that start request and
  only when OPNEX launches a local managed browser. It does not rewrite
  `browser.headless` or profile config, and it is a no-op for an already-running
  browser.
- On Linux hosts without `DISPLAY` or `WAYLAND_DISPLAY`, local managed profiles
  run headless automatically unless `OPNEX_BROWSER_HEADLESS=0`,
  `browser.headless=false`, or `browser.profiles.<name>.headless=false`
  explicitly requests a visible browser.

## If the command is missing

If `opnex browser` is an unknown command, check `plugins.allow` in
`~/.opnex/opnex.json`.

When `plugins.allow` is present, list the bundled browser plugin explicitly
unless the config already has a root `browser` block:

```json5
{
  plugins: {
    allow: ["telegram", "browser"],
  },
}
```

An explicit root `browser` block, for example `browser.enabled=true` or
`browser.profiles.<name>`, also activates the bundled browser plugin under a
restrictive plugin allowlist.

Related: [Browser tool](/tools/browser#missing-browser-command-or-tool)

## Profiles

Profiles are named browser routing configs. In practice:

- `opnex`: launches or attaches to a dedicated OPNEX-managed Chrome instance (isolated user data dir).
- `user`: controls your existing signed-in Chrome session via Chrome DevTools MCP.
- custom CDP profiles: point at a local or remote CDP endpoint.

```bash
opnex browser profiles
opnex browser create-profile --name work --color "#FF5A36"
opnex browser create-profile --name chrome-live --driver existing-session
opnex browser create-profile --name remote --cdp-url https://browser-host.example.com
opnex browser delete-profile --name work
```

Use a specific profile:

```bash
opnex browser --browser-profile work tabs
```

## Tabs

```bash
opnex browser tabs
opnex browser tab new --label docs
opnex browser tab label t1 docs
opnex browser tab select 2
opnex browser tab close 2
opnex browser open https://docs.opnex.ai --label docs
opnex browser focus docs
opnex browser close t1
```

`tabs` returns `suggestedTargetId` first, then the stable `tabId` such as `t1`,
the optional label, and the raw `targetId`. Agents should pass
`suggestedTargetId` back into `focus`, `close`, snapshots, and actions. You can
assign a label with `open --label`, `tab new --label`, or `tab label`; labels,
tab ids, raw target ids, and unique target-id prefixes are all accepted.
When Chromium replaces the underlying raw target during a navigation or form
submit, OPNEX keeps the stable `tabId`/label attached to the replacement tab
when it can prove the match. Raw target ids remain volatile; prefer
`suggestedTargetId`.

## Snapshot / screenshot / actions

Snapshot:

```bash
opnex browser snapshot
opnex browser snapshot --urls
```

Screenshot:

```bash
opnex browser screenshot
opnex browser screenshot --full-page
opnex browser screenshot --ref e12
opnex browser screenshot --labels
```

Notes:

- `--full-page` is for page captures only; it cannot be combined with `--ref`
  or `--element`.
- `existing-session` / `user` profiles support page screenshots and `--ref`
  screenshots from snapshot output, but not CSS `--element` screenshots.
- `--labels` overlays current snapshot refs on the screenshot.
- `snapshot --urls` appends discovered link destinations to AI snapshots so
  agents can choose direct navigation targets instead of guessing from link
  text alone.

Navigate/click/type (ref-based UI automation):

```bash
opnex browser navigate https://example.com
opnex browser click <ref>
opnex browser click-coords 120 340
opnex browser type <ref> "hello"
opnex browser press Enter
opnex browser hover <ref>
opnex browser scrollintoview <ref>
opnex browser drag <startRef> <endRef>
opnex browser select <ref> OptionA OptionB
opnex browser fill --fields '[{"ref":"1","value":"Ada"}]'
opnex browser wait --text "Done"
opnex browser evaluate --fn '(el) => el.textContent' --ref <ref>
```

Action responses return the current raw `targetId` after action-triggered page
replacement when OPNEX can prove the replacement tab. Scripts should still
store and pass `suggestedTargetId`/labels for long-lived workflows.

File + dialog helpers:

```bash
opnex browser upload /tmp/opnex/uploads/file.pdf --ref <ref>
opnex browser waitfordownload
opnex browser download <ref> report.pdf
opnex browser dialog --accept
```

Managed Chrome profiles save ordinary click-triggered downloads into the OPNEX
downloads directory (`/tmp/opnex/downloads` by default, or the configured temp
root). Use `waitfordownload` or `download` when the agent needs to wait for a
specific file and return its path; those explicit waiters own the next download.

## State and storage

Viewport + emulation:

```bash
opnex browser resize 1280 720
opnex browser set viewport 1280 720
opnex browser set offline on
opnex browser set media dark
opnex browser set timezone Europe/London
opnex browser set locale en-GB
opnex browser set geo 51.5074 -0.1278 --accuracy 25
opnex browser set device "iPhone 14"
opnex browser set headers '{"x-test":"1"}'
opnex browser set credentials myuser mypass
```

Cookies + storage:

```bash
opnex browser cookies
opnex browser cookies set session abc123 --url https://example.com
opnex browser cookies clear
opnex browser storage local get
opnex browser storage local set token abc123
opnex browser storage session clear
```

## Debugging

```bash
opnex browser console --level error
opnex browser pdf
opnex browser responsebody "**/api"
opnex browser highlight <ref>
opnex browser errors --clear
opnex browser requests --filter api
opnex browser trace start
opnex browser trace stop --out trace.zip
```

## Existing Chrome via MCP

Use the built-in `user` profile, or create your own `existing-session` profile:

```bash
opnex browser --browser-profile user tabs
opnex browser create-profile --name chrome-live --driver existing-session
opnex browser create-profile --name brave-live --driver existing-session --user-data-dir "~/Library/Application Support/BraveSoftware/Brave-Browser"
opnex browser --browser-profile chrome-live tabs
```

This path is host-only. For Docker, headless servers, Browserless, or other remote setups, use a CDP profile instead.

Current existing-session limits:

- snapshot-driven actions use refs, not CSS selectors
- `browser.actionTimeoutMs` defaults supported `act` requests to 60000 ms when
  callers omit `timeoutMs`; per-call `timeoutMs` still wins.
- `click` is left-click only
- `type` does not support `slowly=true`
- `press` does not support `delayMs`
- `hover`, `scrollintoview`, `drag`, `select`, `fill`, and `evaluate` reject
  per-call timeout overrides
- `select` supports one value only
- `wait --load networkidle` is not supported
- file uploads require `--ref` / `--input-ref`, do not support CSS
  `--element`, and currently support one file at a time
- dialog hooks do not support `--timeout`
- screenshots support page captures and `--ref`, but not CSS `--element`
- `responsebody`, download interception, PDF export, and batch actions still
  require a managed browser or raw CDP profile

## Remote browser control (node host proxy)

If the Gateway runs on a different machine than the browser, run a **node host** on the machine that has Chrome/Brave/Edge/Chromium. The Gateway will proxy browser actions to that node (no separate browser control server required).

Use `gateway.nodes.browser.mode` to control auto-routing and `gateway.nodes.browser.node` to pin a specific node if multiple are connected.

Security + remote setup: [Browser tool](/tools/browser), [Remote access](/gateway/remote), [Tailscale](/gateway/tailscale), [Security](/gateway/security)

## Related

- [CLI reference](/cli)
- [Browser](/tools/browser)
