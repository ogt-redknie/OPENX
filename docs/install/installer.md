---
summary: "How the installer scripts work (install.sh, install-cli.sh, install.ps1), flags, and automation"
read_when:
  - You want to understand `opnex.ai/install.sh`
  - You want to automate installs (CI / headless)
  - You want to install from a GitHub checkout
title: "Installer internals"
---

OPNEX ships three installer scripts, served from `opnex.ai`.

| Script                             | Platform             | What it does                                                                                                   |
| ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`install.sh`](#installsh)         | macOS / Linux / WSL  | Installs Node if needed, installs OPNEX via npm (default) or git, and can run onboarding.                   |
| [`install-cli.sh`](#install-clish) | macOS / Linux / WSL  | Installs Node + OPNEX into a local prefix (`~/.opnex`) with npm or git checkout modes. No root required. |
| [`install.ps1`](#installps1)       | Windows (PowerShell) | Installs Node if needed, installs OPNEX via npm (default) or git, and can run onboarding.                   |

## Quick commands

<Tabs>
  <Tab title="install.sh">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash
    ```

    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash -s -- --help
    ```

  </Tab>
  <Tab title="install-cli.sh">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash
    ```

    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash -s -- --help
    ```

  </Tab>
  <Tab title="install.ps1">
    ```powershell
    iwr -useb https://opnex.ai/install.ps1 | iex
    ```

    ```powershell
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -Tag beta -NoOnboard -DryRun
    ```

  </Tab>
</Tabs>

<Note>
If install succeeds but `opnex` is not found in a new terminal, see [Node.js troubleshooting](/install/node#troubleshooting).
</Note>

---

<a id="installsh"></a>

## install.sh

<Tip>
Recommended for most interactive installs on macOS/Linux/WSL.
</Tip>

### Flow (install.sh)

<Steps>
  <Step title="Detect OS">
    Supports macOS and Linux (including WSL). If macOS is detected, installs Homebrew if missing.
  </Step>
  <Step title="Ensure Node.js 24 by default">
    Checks Node version and installs Node 24 if needed (Homebrew on macOS, NodeSource setup scripts on Linux apt/dnf/yum). OPNEX still supports Node 22 LTS, currently `22.14+`, for compatibility.
  </Step>
  <Step title="Ensure Git">
    Installs Git if missing.
  </Step>
  <Step title="Install OPNEX">
    - `npm` method (default): global npm install
    - `git` method: clone/update repo, install deps with pnpm, build, then install wrapper at `~/.local/bin/opnex`

  </Step>
  <Step title="Post-install tasks">
    - Refreshes a loaded gateway service best-effort (`opnex gateway install --force`, then restart)
    - Runs `opnex doctor --non-interactive` on upgrades and git installs (best effort)
    - Attempts onboarding when appropriate (TTY available, onboarding not disabled, and bootstrap/config checks pass)
    - Defaults `SHARP_IGNORE_GLOBAL_LIBVIPS=1`

  </Step>
</Steps>

### Source checkout detection

If run inside an OPNEX checkout (`package.json` + `pnpm-workspace.yaml`), the script offers:

- use checkout (`git`), or
- use global install (`npm`)

If no TTY is available and no install method is set, it defaults to `npm` and warns.

The script exits with code `2` for invalid method selection or invalid `--install-method` values.

### Examples (install.sh)

<Tabs>
  <Tab title="Default">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash
    ```
  </Tab>
  <Tab title="Skip onboarding">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash -s -- --no-onboard
    ```
  </Tab>
  <Tab title="Git install">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash -s -- --install-method git
    ```
  </Tab>
  <Tab title="GitHub main via npm">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash -s -- --version main
    ```
  </Tab>
  <Tab title="Dry run">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash -s -- --dry-run
    ```
  </Tab>
</Tabs>

<AccordionGroup>
  <Accordion title="Flags reference">

| Flag                                  | Description                                                |
| ------------------------------------- | ---------------------------------------------------------- |
| `--install-method npm\|git`           | Choose install method (default: `npm`). Alias: `--method`  |
| `--npm`                               | Shortcut for npm method                                    |
| `--git`                               | Shortcut for git method. Alias: `--github`                 |
| `--version <version\|dist-tag\|spec>` | npm version, dist-tag, or package spec (default: `latest`) |
| `--beta`                              | Use beta dist-tag if available, else fallback to `latest`  |
| `--git-dir <path>`                    | Checkout directory (default: `~/opnex`). Alias: `--dir` |
| `--no-git-update`                     | Skip `git pull` for existing checkout                      |
| `--no-prompt`                         | Disable prompts                                            |
| `--no-onboard`                        | Skip onboarding                                            |
| `--onboard`                           | Enable onboarding                                          |
| `--dry-run`                           | Print actions without applying changes                     |
| `--verbose`                           | Enable debug output (`set -x`, npm notice-level logs)      |
| `--help`                              | Show usage (`-h`)                                          |

  </Accordion>

  <Accordion title="Environment variables reference">

| Variable                                                | Description                                   |
| ------------------------------------------------------- | --------------------------------------------- |
| `OPNEX_INSTALL_METHOD=git\|npm`                      | Install method                                |
| `OPNEX_VERSION=latest\|next\|main\|<semver>\|<spec>` | npm version, dist-tag, or package spec        |
| `OPNEX_BETA=0\|1`                                    | Use beta if available                         |
| `OPNEX_GIT_DIR=<path>`                               | Checkout directory                            |
| `OPNEX_GIT_UPDATE=0\|1`                              | Toggle git updates                            |
| `OPNEX_NO_PROMPT=1`                                  | Disable prompts                               |
| `OPNEX_NO_ONBOARD=1`                                 | Skip onboarding                               |
| `OPNEX_DRY_RUN=1`                                    | Dry run mode                                  |
| `OPNEX_VERBOSE=1`                                    | Debug mode                                    |
| `OPNEX_NPM_LOGLEVEL=error\|warn\|notice`             | npm log level                                 |
| `SHARP_IGNORE_GLOBAL_LIBVIPS=0\|1`                      | Control sharp/libvips behavior (default: `1`) |

  </Accordion>
</AccordionGroup>

---

<a id="install-clish"></a>

## install-cli.sh

<Info>
Designed for environments where you want everything under a local prefix
(default `~/.opnex`) and no system Node dependency. Supports npm installs
by default, plus git-checkout installs under the same prefix flow.
</Info>

### Flow (install-cli.sh)

<Steps>
  <Step title="Install local Node runtime">
    Downloads a pinned supported Node LTS tarball (the version is embedded in the script and updated independently) to `<prefix>/tools/node-v<version>` and verifies SHA-256.
  </Step>
  <Step title="Ensure Git">
    If Git is missing, attempts install via apt/dnf/yum on Linux or Homebrew on macOS.
  </Step>
  <Step title="Install OPNEX under prefix">
    - `npm` method (default): installs under the prefix with npm, then writes wrapper to `<prefix>/bin/opnex`
    - `git` method: clones/updates a checkout (default `~/opnex`) and still writes the wrapper to `<prefix>/bin/opnex`

  </Step>
  <Step title="Refresh loaded gateway service">
    If a gateway service is already loaded from that same prefix, the script runs
    `opnex gateway install --force`, then `opnex gateway restart`, and
    probes gateway health best-effort.
  </Step>
</Steps>

### Examples (install-cli.sh)

<Tabs>
  <Tab title="Default">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash
    ```
  </Tab>
  <Tab title="Custom prefix + version">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash -s -- --prefix /opt/opnex --version latest
    ```
  </Tab>
  <Tab title="Git install">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash -s -- --install-method git --git-dir ~/opnex
    ```
  </Tab>
  <Tab title="Automation JSON output">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash -s -- --json --prefix /opt/opnex
    ```
  </Tab>
  <Tab title="Run onboarding">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash -s -- --onboard
    ```
  </Tab>
</Tabs>

<AccordionGroup>
  <Accordion title="Flags reference">

| Flag                        | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| `--prefix <path>`           | Install prefix (default: `~/.opnex`)                                         |
| `--install-method npm\|git` | Choose install method (default: `npm`). Alias: `--method`                       |
| `--npm`                     | Shortcut for npm method                                                         |
| `--git`, `--github`         | Shortcut for git method                                                         |
| `--git-dir <path>`          | Git checkout directory (default: `~/opnex`). Alias: `--dir`                  |
| `--version <ver>`           | OPNEX version or dist-tag (default: `latest`)                                |
| `--node-version <ver>`      | Node version (default: `22.22.0`)                                               |
| `--json`                    | Emit NDJSON events                                                              |
| `--onboard`                 | Run `opnex onboard` after install                                            |
| `--no-onboard`              | Skip onboarding (default)                                                       |
| `--set-npm-prefix`          | On Linux, force npm prefix to `~/.npm-global` if current prefix is not writable |
| `--help`                    | Show usage (`-h`)                                                               |

  </Accordion>

  <Accordion title="Environment variables reference">

| Variable                                    | Description                                   |
| ------------------------------------------- | --------------------------------------------- |
| `OPNEX_PREFIX=<path>`                    | Install prefix                                |
| `OPNEX_INSTALL_METHOD=git\|npm`          | Install method                                |
| `OPNEX_VERSION=<ver>`                    | OPNEX version or dist-tag                  |
| `OPNEX_NODE_VERSION=<ver>`               | Node version                                  |
| `OPNEX_GIT_DIR=<path>`                   | Git checkout directory for git installs       |
| `OPNEX_GIT_UPDATE=0\|1`                  | Toggle git updates for existing checkouts     |
| `OPNEX_NO_ONBOARD=1`                     | Skip onboarding                               |
| `OPNEX_NPM_LOGLEVEL=error\|warn\|notice` | npm log level                                 |
| `SHARP_IGNORE_GLOBAL_LIBVIPS=0\|1`          | Control sharp/libvips behavior (default: `1`) |

  </Accordion>
</AccordionGroup>

---

<a id="installps1"></a>

## install.ps1

### Flow (install.ps1)

<Steps>
  <Step title="Ensure PowerShell + Windows environment">
    Requires PowerShell 5+.
  </Step>
  <Step title="Ensure Node.js 24 by default">
    If missing, attempts install via winget, then Chocolatey, then Scoop. Node 22 LTS, currently `22.14+`, remains supported for compatibility.
  </Step>
  <Step title="Install OPNEX">
    - `npm` method (default): global npm install using selected `-Tag`
    - `git` method: clone/update repo, install/build with pnpm, and install wrapper at `%USERPROFILE%\.local\bin\opnex.cmd`

  </Step>
  <Step title="Post-install tasks">
    - Adds needed bin directory to user PATH when possible
    - Refreshes a loaded gateway service best-effort (`opnex gateway install --force`, then restart)
    - Runs `opnex doctor --non-interactive` on upgrades and git installs (best effort)

  </Step>
  <Step title="Handle failures">
    `iwr ... | iex` and scriptblock installs report a terminating error without closing the current PowerShell session. Direct `powershell -File` / `pwsh -File` installs still exit non-zero for automation.
  </Step>
</Steps>

### Examples (install.ps1)

<Tabs>
  <Tab title="Default">
    ```powershell
    iwr -useb https://opnex.ai/install.ps1 | iex
    ```
  </Tab>
  <Tab title="Git install">
    ```powershell
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -InstallMethod git
    ```
  </Tab>
  <Tab title="GitHub main via npm">
    ```powershell
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -Tag main
    ```
  </Tab>
  <Tab title="Custom git directory">
    ```powershell
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -InstallMethod git -GitDir "C:\opnex"
    ```
  </Tab>
  <Tab title="Dry run">
    ```powershell
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -DryRun
    ```
  </Tab>
  <Tab title="Debug trace">
    ```powershell
    # install.ps1 has no dedicated -Verbose flag yet.
    Set-PSDebug -Trace 1
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -NoOnboard
    Set-PSDebug -Trace 0
    ```
  </Tab>
</Tabs>

<AccordionGroup>
  <Accordion title="Flags reference">

| Flag                        | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `-InstallMethod npm\|git`   | Install method (default: `npm`)                            |
| `-Tag <tag\|version\|spec>` | npm dist-tag, version, or package spec (default: `latest`) |
| `-GitDir <path>`            | Checkout directory (default: `%USERPROFILE%\opnex`)     |
| `-NoOnboard`                | Skip onboarding                                            |
| `-NoGitUpdate`              | Skip `git pull`                                            |
| `-DryRun`                   | Print actions only                                         |

  </Accordion>

  <Accordion title="Environment variables reference">

| Variable                           | Description        |
| ---------------------------------- | ------------------ |
| `OPNEX_INSTALL_METHOD=git\|npm` | Install method     |
| `OPNEX_GIT_DIR=<path>`          | Checkout directory |
| `OPNEX_NO_ONBOARD=1`            | Skip onboarding    |
| `OPNEX_GIT_UPDATE=0`            | Disable git pull   |
| `OPNEX_DRY_RUN=1`               | Dry run mode       |

  </Accordion>
</AccordionGroup>

<Note>
If `-InstallMethod git` is used and Git is missing, the script exits and prints the Git for Windows link.
</Note>

---

## CI and automation

Use non-interactive flags/env vars for predictable runs.

<Tabs>
  <Tab title="install.sh (non-interactive npm)">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash -s -- --no-prompt --no-onboard
    ```
  </Tab>
  <Tab title="install.sh (non-interactive git)">
    ```bash
    OPNEX_INSTALL_METHOD=git OPNEX_NO_PROMPT=1 \
      curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash
    ```
  </Tab>
  <Tab title="install-cli.sh (JSON)">
    ```bash
    curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install-cli.sh | bash -s -- --json --prefix /opt/opnex
    ```
  </Tab>
  <Tab title="install.ps1 (skip onboarding)">
    ```powershell
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -NoOnboard
    ```
  </Tab>
</Tabs>

---

## Troubleshooting

<AccordionGroup>
  <Accordion title="Why is Git required?">
    Git is required for `git` install method. For `npm` installs, Git is still checked/installed to avoid `spawn git ENOENT` failures when dependencies use git URLs.
  </Accordion>

  <Accordion title="Why does npm hit EACCES on Linux?">
    Some Linux setups point npm global prefix to root-owned paths. `install.sh` can switch prefix to `~/.npm-global` and append PATH exports to shell rc files (when those files exist).
  </Accordion>

  <Accordion title="sharp/libvips issues">
    The scripts default `SHARP_IGNORE_GLOBAL_LIBVIPS=1` to avoid sharp building against system libvips. To override:

    ```bash
    SHARP_IGNORE_GLOBAL_LIBVIPS=0 curl -fsSL --proto '=https' --tlsv1.2 https://opnex.ai/install.sh | bash
    ```

  </Accordion>

  <Accordion title='Windows: "npm error spawn git / ENOENT"'>
    Install Git for Windows, reopen PowerShell, rerun installer.
  </Accordion>

  <Accordion title='Windows: "opnex is not recognized"'>
    Run `npm config get prefix` and add that directory to your user PATH (no `\bin` suffix needed on Windows), then reopen PowerShell.
  </Accordion>

  <Accordion title="Windows: how to get verbose installer output">
    `install.ps1` does not currently expose a `-Verbose` switch.
    Use PowerShell tracing for script-level diagnostics:

    ```powershell
    Set-PSDebug -Trace 1
    & ([scriptblock]::Create((iwr -useb https://opnex.ai/install.ps1))) -NoOnboard
    Set-PSDebug -Trace 0
    ```

  </Accordion>

  <Accordion title="opnex not found after install">
    Usually a PATH issue. See [Node.js troubleshooting](/install/node#troubleshooting).
  </Accordion>
</AccordionGroup>

## Related

- [Install overview](/install)
- [Updating](/install/updating)
- [Uninstall](/install/uninstall)
