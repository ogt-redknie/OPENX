import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveDefaultAgentWorkspaceDir } from "./workspace.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("DEFAULT_AGENT_WORKSPACE_DIR", () => {
  it("uses OPNEX_HOME when resolving the default workspace dir", () => {
    const home = path.join(path.sep, "srv", "opnex-home");
    vi.stubEnv("OPNEX_HOME", home);
    vi.stubEnv("HOME", path.join(path.sep, "home", "other"));

    expect(resolveDefaultAgentWorkspaceDir()).toBe(
      path.join(path.resolve(home), ".opnex", "workspace"),
    );
  });
});
