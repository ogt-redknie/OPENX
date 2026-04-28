import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "opnex",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "opnex", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("leaves gateway --dev for subcommands after leading root options", () => {
    const res = parseCliProfileArgs([
      "node",
      "opnex",
      "--no-color",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual([
      "node",
      "opnex",
      "--no-color",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "opnex", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "opnex", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "opnex", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "opnex", "status"]);
  });

  it("parses interleaved --profile after the command token", () => {
    const res = parseCliProfileArgs(["node", "opnex", "status", "--profile", "work", "--deep"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "opnex", "status", "--deep"]);
  });

  it("preserves Matrix QA --profile for the command parser", () => {
    const res = parseCliProfileArgs([
      "node",
      "opnex",
      "qa",
      "matrix",
      "--profile",
      "fast",
      "--fail-fast",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual([
      "node",
      "opnex",
      "qa",
      "matrix",
      "--profile",
      "fast",
      "--fail-fast",
    ]);
  });

  it("preserves Matrix QA --profile after leading root options", () => {
    const res = parseCliProfileArgs([
      "node",
      "opnex",
      "--no-color",
      "qa",
      "matrix",
      "--profile=fast",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "opnex", "--no-color", "qa", "matrix", "--profile=fast"]);
  });

  it("still parses root --profile before Matrix QA", () => {
    const res = parseCliProfileArgs([
      "node",
      "opnex",
      "--profile",
      "work",
      "qa",
      "matrix",
      "--fail-fast",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "opnex", "qa", "matrix", "--fail-fast"]);
  });

  it("parses interleaved --dev after the command token", () => {
    const res = parseCliProfileArgs(["node", "opnex", "status", "--dev"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "opnex", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "opnex", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "opnex", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "opnex", "--profile", "work", "--dev", "status"]],
    ["interleaved after command", ["node", "opnex", "status", "--profile", "work", "--dev"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".opnex-dev");
    expect(env.OPNEX_PROFILE).toBe("dev");
    expect(env.OPNEX_STATE_DIR).toBe(expectedStateDir);
    expect(env.OPNEX_CONFIG_PATH).toBe(path.join(expectedStateDir, "opnex.json"));
    expect(env.OPNEX_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      OPNEX_STATE_DIR: "/custom",
      OPNEX_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.OPNEX_STATE_DIR).toBe("/custom");
    expect(env.OPNEX_GATEWAY_PORT).toBe("19099");
    expect(env.OPNEX_CONFIG_PATH).toBe(path.join("/custom", "opnex.json"));
  });

  it("uses OPNEX_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      OPNEX_HOME: "/srv/opnex-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/opnex-home");
    expect(env.OPNEX_STATE_DIR).toBe(path.join(resolvedHome, ".opnex-work"));
    expect(env.OPNEX_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".opnex-work", "opnex.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "opnex doctor --fix",
      env: {},
      expected: "opnex doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "opnex doctor --fix",
      env: { OPNEX_PROFILE: "default" },
      expected: "opnex doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "opnex doctor --fix",
      env: { OPNEX_PROFILE: "Default" },
      expected: "opnex doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "opnex doctor --fix",
      env: { OPNEX_PROFILE: "bad profile" },
      expected: "opnex doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "opnex --profile work doctor --fix",
      env: { OPNEX_PROFILE: "work" },
      expected: "opnex --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "opnex --dev doctor",
      env: { OPNEX_PROFILE: "dev" },
      expected: "opnex --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("opnex doctor --fix", { OPNEX_PROFILE: "work" })).toBe(
      "opnex --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("opnex doctor --fix", { OPNEX_PROFILE: "  jbopnex  " })).toBe(
      "opnex --profile jbopnex doctor --fix",
    );
  });

  it("handles command with no args after opnex", () => {
    expect(formatCliCommand("opnex", { OPNEX_PROFILE: "test" })).toBe(
      "opnex --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm opnex doctor", { OPNEX_PROFILE: "work" })).toBe(
      "pnpm opnex --profile work doctor",
    );
  });

  it("inserts --container when a container hint is set", () => {
    expect(
      formatCliCommand("opnex gateway status --deep", { OPNEX_CONTAINER_HINT: "demo" }),
    ).toBe("opnex --container demo gateway status --deep");
  });

  it("ignores unsafe container hints", () => {
    expect(
      formatCliCommand("opnex gateway status --deep", {
        OPNEX_CONTAINER_HINT: "demo; rm -rf /",
      }),
    ).toBe("opnex gateway status --deep");
  });

  it("preserves both --container and --profile hints", () => {
    expect(
      formatCliCommand("opnex doctor", {
        OPNEX_CONTAINER_HINT: "demo",
        OPNEX_PROFILE: "work",
      }),
    ).toBe("opnex --container demo doctor");
  });

  it("does not prepend --container for update commands", () => {
    expect(formatCliCommand("opnex update", { OPNEX_CONTAINER_HINT: "demo" })).toBe(
      "opnex update",
    );
    expect(
      formatCliCommand("pnpm opnex update --channel beta", { OPNEX_CONTAINER_HINT: "demo" }),
    ).toBe("pnpm opnex update --channel beta");
  });
});
