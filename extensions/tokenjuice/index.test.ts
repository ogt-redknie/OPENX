import fs from "node:fs";
import { createTestPluginApi } from "opnex/plugin-sdk/plugin-test-api";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { tokenjuiceFactory, createTokenjuiceOPNEXEmbeddedExtension } = vi.hoisted(() => {
  const tokenjuiceFactory = vi.fn();
  const createTokenjuiceOPNEXEmbeddedExtension = vi.fn(() => tokenjuiceFactory);
  return {
    tokenjuiceFactory,
    createTokenjuiceOPNEXEmbeddedExtension,
  };
});

vi.mock("./runtime-api.js", () => ({
  createTokenjuiceOPNEXEmbeddedExtension,
}));

import plugin from "./index.js";

describe("tokenjuice bundled plugin", () => {
  beforeEach(() => {
    createTokenjuiceOPNEXEmbeddedExtension.mockClear();
    tokenjuiceFactory.mockClear();
  });

  it("is opt-in by default", () => {
    const manifest = JSON.parse(
      fs.readFileSync(new URL("./opnex.plugin.json", import.meta.url), "utf8"),
    ) as { enabledByDefault?: unknown };

    expect(manifest.enabledByDefault).toBeUndefined();
  });

  it("registers tokenjuice tool result middleware for Pi and Codex runtimes", () => {
    const registerAgentToolResultMiddleware = vi.fn();

    plugin.register(
      createTestPluginApi({
        id: "tokenjuice",
        name: "tokenjuice",
        source: "test",
        config: {},
        pluginConfig: {},
        runtime: {} as never,
        registerAgentToolResultMiddleware,
      }),
    );

    expect(createTokenjuiceOPNEXEmbeddedExtension).toHaveBeenCalledTimes(1);
    expect(tokenjuiceFactory).toHaveBeenCalledTimes(1);
    expect(registerAgentToolResultMiddleware).toHaveBeenCalledWith(expect.any(Function), {
      runtimes: ["pi", "codex"],
    });
  });
});
