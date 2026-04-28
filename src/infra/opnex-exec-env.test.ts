import { describe, expect, it } from "vitest";
import {
  ensureOPNEXExecMarkerOnProcess,
  markOPNEXExecEnv,
  OPNEX_CLI_ENV_VALUE,
  OPNEX_CLI_ENV_VAR,
} from "./opnex-exec-env.js";

describe("markOPNEXExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", OPNEX_CLI: "0" };
    const marked = markOPNEXExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      OPNEX_CLI: OPNEX_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.OPNEX_CLI).toBe("0");
  });
});

describe("ensureOPNEXExecMarkerOnProcess", () => {
  it.each([
    {
      name: "mutates and returns the provided process env",
      env: { PATH: "/usr/bin" } as NodeJS.ProcessEnv,
    },
    {
      name: "overwrites an existing marker on the provided process env",
      env: { PATH: "/usr/bin", [OPNEX_CLI_ENV_VAR]: "0" } as NodeJS.ProcessEnv,
    },
  ])("$name", ({ env }) => {
    expect(ensureOPNEXExecMarkerOnProcess(env)).toBe(env);
    expect(env[OPNEX_CLI_ENV_VAR]).toBe(OPNEX_CLI_ENV_VALUE);
  });

  it("defaults to mutating process.env when no env object is provided", () => {
    const previous = process.env[OPNEX_CLI_ENV_VAR];
    delete process.env[OPNEX_CLI_ENV_VAR];

    try {
      expect(ensureOPNEXExecMarkerOnProcess()).toBe(process.env);
      expect(process.env[OPNEX_CLI_ENV_VAR]).toBe(OPNEX_CLI_ENV_VALUE);
    } finally {
      if (previous === undefined) {
        delete process.env[OPNEX_CLI_ENV_VAR];
      } else {
        process.env[OPNEX_CLI_ENV_VAR] = previous;
      }
    }
  });
});
