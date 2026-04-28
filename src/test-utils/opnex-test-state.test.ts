import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createOPNEXTestState, withOPNEXTestState } from "./opnex-test-state.js";

describe("opnex test state", () => {
  it("creates an isolated home layout with spawn env and restores process env", async () => {
    const previousHome = process.env.HOME;
    const previousOPNEXHome = process.env.OPNEX_HOME;
    const previousStateDir = process.env.OPNEX_STATE_DIR;
    const previousConfigPath = process.env.OPNEX_CONFIG_PATH;

    const state = await createOPNEXTestState({
      label: "unit",
      scenario: "minimal",
    });

    expect(state.home).toBe(path.join(state.root, "home"));
    expect(state.stateDir).toBe(path.join(state.home, ".opnex"));
    expect(state.configPath).toBe(path.join(state.stateDir, "opnex.json"));
    expect(state.workspaceDir).toBe(path.join(state.home, "workspace"));
    expect(state.env.HOME).toBe(state.home);
    expect(state.env.OPNEX_HOME).toBe(state.home);
    expect(state.env.OPNEX_STATE_DIR).toBe(state.stateDir);
    expect(state.env.OPNEX_CONFIG_PATH).toBe(state.configPath);
    expect(process.env.HOME).toBe(state.home);
    expect(process.env.OPNEX_HOME).toBe(state.home);
    expect(JSON.parse(await fs.readFile(state.configPath, "utf8"))).toEqual({});

    await state.cleanup();

    expect(process.env.HOME).toBe(previousHome);
    expect(process.env.OPNEX_HOME).toBe(previousOPNEXHome);
    expect(process.env.OPNEX_STATE_DIR).toBe(previousStateDir);
    expect(process.env.OPNEX_CONFIG_PATH).toBe(previousConfigPath);
    await expect(fs.stat(state.root)).rejects.toThrow();
  });

  it("supports state-only layout without overriding HOME", async () => {
    const previousHome = process.env.HOME;

    await withOPNEXTestState(
      {
        layout: "state-only",
        scenario: "empty",
      },
      async (state) => {
        expect(process.env.HOME).toBe(previousHome);
        expect(process.env.OPNEX_STATE_DIR).toBe(state.stateDir);
        expect(process.env.OPNEX_CONFIG_PATH).toBe(state.configPath);
        expect(state.env.HOME).toBe(previousHome);
        await expect(fs.stat(state.configPath)).rejects.toThrow();
      },
    );
  });

  it("clears inherited agent-dir overrides by default", async () => {
    const previousAgentDir = process.env.OPNEX_AGENT_DIR;
    const previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    process.env.OPNEX_AGENT_DIR = "/tmp/outside-opnex-agent";
    process.env.PI_CODING_AGENT_DIR = "/tmp/outside-pi-agent";

    try {
      const state = await createOPNEXTestState({
        layout: "state-only",
      });

      try {
        expect(process.env.OPNEX_AGENT_DIR).toBeUndefined();
        expect(process.env.PI_CODING_AGENT_DIR).toBeUndefined();
        expect(state.env.OPNEX_AGENT_DIR).toBeUndefined();
        expect(state.env.PI_CODING_AGENT_DIR).toBeUndefined();
        expect(state.agentDir()).toBe(path.join(state.stateDir, "agents", "main", "agent"));
      } finally {
        await state.cleanup();
      }

      expect(process.env.OPNEX_AGENT_DIR).toBe("/tmp/outside-opnex-agent");
      expect(process.env.PI_CODING_AGENT_DIR).toBe("/tmp/outside-pi-agent");
    } finally {
      if (previousAgentDir === undefined) {
        delete process.env.OPNEX_AGENT_DIR;
      } else {
        process.env.OPNEX_AGENT_DIR = previousAgentDir;
      }
      if (previousPiAgentDir === undefined) {
        delete process.env.PI_CODING_AGENT_DIR;
      } else {
        process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
      }
    }
  });

  it("allows explicit agent-dir overrides when a test needs them", async () => {
    await withOPNEXTestState(
      {
        env: {
          OPNEX_AGENT_DIR: "/tmp/explicit-opnex-agent",
          PI_CODING_AGENT_DIR: "/tmp/explicit-pi-agent",
        },
      },
      async (state) => {
        expect(process.env.OPNEX_AGENT_DIR).toBe("/tmp/explicit-opnex-agent");
        expect(process.env.PI_CODING_AGENT_DIR).toBe("/tmp/explicit-pi-agent");
        expect(state.env.OPNEX_AGENT_DIR).toBe("/tmp/explicit-opnex-agent");
        expect(state.env.PI_CODING_AGENT_DIR).toBe("/tmp/explicit-pi-agent");
      },
    );
  });

  it("can route agent-dir env vars to the isolated main agent store", async () => {
    await withOPNEXTestState(
      {
        agentEnv: "main",
      },
      async (state) => {
        expect(process.env.OPNEX_AGENT_DIR).toBe(state.agentDir());
        expect(process.env.PI_CODING_AGENT_DIR).toBe(state.agentDir());
        expect(state.env.OPNEX_AGENT_DIR).toBe(state.agentDir());
        expect(state.env.PI_CODING_AGENT_DIR).toBe(state.agentDir());
      },
    );
  });

  it("writes scenario configs and auth profile stores", async () => {
    await withOPNEXTestState(
      {
        scenario: "update-stable",
      },
      async (state) => {
        expect(JSON.parse(await fs.readFile(state.configPath, "utf8"))).toEqual({
          update: {
            channel: "stable",
          },
          plugins: {},
        });

        const profilePath = await state.writeAuthProfiles({
          version: 1,
          profiles: {
            "openai:test": {
              type: "api_key",
              provider: "openai",
              key: "sk-test",
            },
          },
        });

        expect(profilePath).toBe(path.join(state.agentDir(), "auth-profiles.json"));
        expect(JSON.parse(await fs.readFile(profilePath, "utf8"))).toMatchObject({
          version: 1,
          profiles: {
            "openai:test": {
              provider: "openai",
            },
          },
        });
      },
    );
  });

  it("keeps external-service env scoped to the fixture", async () => {
    const previousPolicy = process.env.OPNEX_SERVICE_REPAIR_POLICY;

    await withOPNEXTestState(
      {
        scenario: "external-service",
      },
      async (state) => {
        expect(process.env.OPNEX_SERVICE_REPAIR_POLICY).toBe("external");
        expect(state.env.OPNEX_SERVICE_REPAIR_POLICY).toBe("external");
      },
    );

    expect(process.env.OPNEX_SERVICE_REPAIR_POLICY).toBe(previousPolicy);
  });
});
