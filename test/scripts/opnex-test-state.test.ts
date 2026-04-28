import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const scriptPath = path.join(repoRoot, "scripts/lib/opnex-test-state.mjs");

function shellQuote(value: string): string {
  return `'${value.replace(/'/gu, `'\\''`)}'`;
}

describe("scripts/lib/opnex-test-state", () => {
  it("creates a sourceable env file and JSON description", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "opnex-test-state-script-"));
    const envFile = path.join(tempRoot, "env.sh");
    try {
      const { stdout } = await execFileAsync(process.execPath, [
        scriptPath,
        "--",
        "create",
        "--label",
        "script-test",
        "--scenario",
        "update-stable",
        "--env-file",
        envFile,
        "--json",
      ]);
      const payload = JSON.parse(stdout);
      expect(payload).toMatchObject({
        label: "script-test",
        scenario: "update-stable",
        home: expect.any(String),
        stateDir: expect.any(String),
        configPath: expect.any(String),
        workspaceDir: expect.any(String),
        env: {
          HOME: expect.any(String),
          OPNEX_HOME: expect.any(String),
          OPNEX_STATE_DIR: expect.any(String),
          OPNEX_CONFIG_PATH: expect.any(String),
        },
      });
      expect(payload.config).toEqual({
        update: {
          channel: "stable",
        },
        plugins: {},
      });

      const envFileText = await fs.readFile(envFile, "utf8");
      expect(envFileText).toContain("export HOME=");
      expect(envFileText).toContain("export OPNEX_HOME=");
      expect(envFileText).toContain("export OPNEX_STATE_DIR=");
      expect(envFileText).toContain("export OPNEX_CONFIG_PATH=");

      const probe = await execFileAsync("bash", [
        "-lc",
        `source ${shellQuote(envFile)}; node -e 'const fs=require("node:fs"); const config=JSON.parse(fs.readFileSync(process.env.OPNEX_CONFIG_PATH,"utf8")); process.stdout.write(JSON.stringify({home:process.env.HOME,stateDir:process.env.OPNEX_STATE_DIR,channel:config.update.channel}));'`,
      ]);
      expect(JSON.parse(probe.stdout)).toEqual({
        home: payload.home,
        stateDir: payload.stateDir,
        channel: "stable",
      });
      await fs.rm(payload.root, { recursive: true, force: true });
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true });
    }
  });

  it("renders a Docker-friendly shell snippet", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "opnex-test-state-shell-"));
    const snippetFile = path.join(tempRoot, "state.sh");
    try {
      const { stdout } = await execFileAsync(process.execPath, [
        scriptPath,
        "shell",
        "--label",
        "update-channel-switch",
        "--scenario",
        "update-stable",
      ]);
      expect(stdout).toContain(
        "mktemp -d '/tmp/opnex-update-channel-switch-update-stable-home.XXXXXX'",
      );
      expect(stdout).toContain("OPNEX_TEST_STATE_JSON");
      expect(stdout).toContain('"channel": "stable"');
      await fs.writeFile(snippetFile, stdout, "utf8");

      const probe = await execFileAsync("bash", [
        "-lc",
        `source ${shellQuote(snippetFile)}; node -e 'const fs=require("node:fs"); const config=JSON.parse(fs.readFileSync(process.env.OPNEX_CONFIG_PATH,"utf8")); process.stdout.write(JSON.stringify({home:process.env.HOME,opnexHome:process.env.OPNEX_HOME,workspace:process.env.OPNEX_TEST_WORKSPACE_DIR,channel:config.update.channel}));'; rm -rf "$HOME"`,
      ]);

      const payload = JSON.parse(probe.stdout);
      expect(payload.home).toMatch(/^\/tmp\/opnex-update-channel-switch-update-stable-home\./u);
      expect(payload.opnexHome).toBe(payload.home);
      expect(payload.workspace).toBe(`${payload.home}/workspace`);
      expect(payload.channel).toBe("stable");
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true });
    }
  });

  it("renders a reusable Docker shell function", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "opnex-test-state-function-"));
    const snippetFile = path.join(tempRoot, "state-function.sh");
    try {
      const { stdout } = await execFileAsync(process.execPath, [scriptPath, "shell-function"]);
      expect(stdout).toContain("opnex_test_state_create()");
      expect(stdout).toContain("unset OPNEX_AGENT_DIR");
      expect(stdout).toContain("update-stable");
      await fs.writeFile(snippetFile, stdout, "utf8");

      const probe = await execFileAsync("bash", [
        "-lc",
        `source ${shellQuote(snippetFile)}; export OPNEX_AGENT_DIR=/tmp/outside-agent; opnex_test_state_create "onboard case" minimal; node -e 'const fs=require("node:fs"); const config=JSON.parse(fs.readFileSync(process.env.OPNEX_CONFIG_PATH,"utf8")); process.stdout.write(JSON.stringify({home:process.env.HOME,agentDir:process.env.OPNEX_AGENT_DIR || null,workspace:process.env.OPNEX_TEST_WORKSPACE_DIR,config}));'; rm -rf "$HOME"`,
      ]);

      const payload = JSON.parse(probe.stdout);
      expect(payload.home).toMatch(/^\/tmp\/opnex-onboard-case-minimal-home\./u);
      expect(payload.agentDir).toBeNull();
      expect(payload.workspace).toBe(`${payload.home}/workspace`);
      expect(payload.config).toEqual({});

      const existingHome = path.join(tempRoot, "existing-home");
      const existingProbe = await execFileAsync("bash", [
        "-lc",
        `source ${shellQuote(snippetFile)}; opnex_test_state_create ${shellQuote(existingHome)} minimal; printf '{"kept":true}\\n' > "$OPNEX_CONFIG_PATH"; opnex_test_state_create ${shellQuote(existingHome)} empty; node -e 'const fs=require("node:fs"); const config=JSON.parse(fs.readFileSync(process.env.OPNEX_CONFIG_PATH,"utf8")); process.stdout.write(JSON.stringify({home:process.env.HOME,config}));'`,
      ]);

      const existingPayload = JSON.parse(existingProbe.stdout);
      expect(existingPayload.home).toBe(existingHome);
      expect(existingPayload.config).toEqual({ kept: true });
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true });
    }
  });
});
