import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OPNEXConfig } from "../config/config.js";

const ensureOPNEXModelsJsonMock = vi.fn<
  (
    config: unknown,
    agentDir: unknown,
    options?: unknown,
  ) => Promise<{ agentDir: string; wrote: boolean }>
>(async () => ({ agentDir: "/tmp/agent", wrote: false }));
const piModelModuleLoadedMock = vi.fn();
const resolveEmbeddedAgentRuntimeMock = vi.fn(() => "auto");

vi.mock("../agents/agent-paths.js", () => ({
  resolveOPNEXAgentDir: () => "/tmp/agent",
}));

vi.mock("../agents/models-config.js", () => ({
  ensureOPNEXModelsJson: (config: unknown, agentDir: unknown, options?: unknown) =>
    ensureOPNEXModelsJsonMock(config, agentDir, options),
}));

vi.mock("../agents/pi-embedded-runner/model.js", () => {
  piModelModuleLoadedMock();
  return {
    resolveModel: () => ({}),
  };
});

vi.mock("../agents/pi-embedded-runner/runtime.js", () => ({
  resolveEmbeddedAgentRuntime: () => resolveEmbeddedAgentRuntimeMock(),
}));

let prewarmConfiguredPrimaryModel: typeof import("./server-startup.js").__testing.prewarmConfiguredPrimaryModel;

describe("gateway startup primary model warmup", () => {
  beforeAll(async () => {
    ({
      __testing: { prewarmConfiguredPrimaryModel },
    } = await import("./server-startup.js"));
  });

  beforeEach(() => {
    ensureOPNEXModelsJsonMock.mockClear();
    piModelModuleLoadedMock.mockClear();
    resolveEmbeddedAgentRuntimeMock.mockClear();
    resolveEmbeddedAgentRuntimeMock.mockReturnValue("auto");
  });

  it("prewarms an explicit configured primary model", async () => {
    const cfg = {
      agents: {
        defaults: {
          model: {
            primary: "openai-codex/gpt-5.4",
          },
        },
      },
    } as OPNEXConfig;

    await prewarmConfiguredPrimaryModel({
      cfg,
      log: { warn: vi.fn() },
    });

    expect(ensureOPNEXModelsJsonMock).toHaveBeenCalledWith(
      cfg,
      "/tmp/agent",
      expect.objectContaining({
        providerDiscoveryProviderIds: ["openai-codex"],
        providerDiscoveryTimeoutMs: 5000,
      }),
    );
    expect(piModelModuleLoadedMock).not.toHaveBeenCalled();
  });

  it("skips warmup when no explicit primary model is configured", async () => {
    await prewarmConfiguredPrimaryModel({
      cfg: {} as OPNEXConfig,
      log: { warn: vi.fn() },
    });

    expect(ensureOPNEXModelsJsonMock).not.toHaveBeenCalled();
    expect(piModelModuleLoadedMock).not.toHaveBeenCalled();
  });

  it("skips static warmup for configured CLI backends", async () => {
    await prewarmConfiguredPrimaryModel({
      cfg: {
        agents: {
          defaults: {
            model: {
              primary: "codex-cli/gpt-5.5",
            },
            cliBackends: {
              "codex-cli": {
                command: "codex",
                args: ["exec"],
              },
            },
          },
        },
      } as OPNEXConfig,
      log: { warn: vi.fn() },
    });

    expect(ensureOPNEXModelsJsonMock).not.toHaveBeenCalled();
    expect(piModelModuleLoadedMock).not.toHaveBeenCalled();
  });

  it("skips static warmup when a non-PI agent runtime is forced", async () => {
    resolveEmbeddedAgentRuntimeMock.mockReturnValue("codex");
    await prewarmConfiguredPrimaryModel({
      cfg: {
        agents: {
          defaults: {
            model: {
              primary: "codex/gpt-5.4",
            },
          },
        },
      } as OPNEXConfig,
      log: { warn: vi.fn() },
    });

    expect(ensureOPNEXModelsJsonMock).not.toHaveBeenCalled();
    expect(piModelModuleLoadedMock).not.toHaveBeenCalled();
  });

  it("keeps PI static warmup when the PI agent runtime is forced", async () => {
    resolveEmbeddedAgentRuntimeMock.mockReturnValue("pi");
    const cfg = {
      agents: {
        defaults: {
          model: {
            primary: "openai-codex/gpt-5.4",
          },
        },
      },
    } as OPNEXConfig;

    await prewarmConfiguredPrimaryModel({
      cfg,
      log: { warn: vi.fn() },
    });

    expect(ensureOPNEXModelsJsonMock).toHaveBeenCalledWith(
      cfg,
      "/tmp/agent",
      expect.objectContaining({
        providerDiscoveryProviderIds: ["openai-codex"],
        providerDiscoveryTimeoutMs: 5000,
      }),
    );
    expect(piModelModuleLoadedMock).not.toHaveBeenCalled();
  });

  it("warns when scoped models.json preparation fails", async () => {
    ensureOPNEXModelsJsonMock.mockRejectedValueOnce(new Error("models write failed"));
    const warn = vi.fn();

    await prewarmConfiguredPrimaryModel({
      cfg: {
        agents: {
          defaults: {
            model: {
              primary: "codex/gpt-5.4",
            },
          },
        },
      } as OPNEXConfig,
      log: { warn },
    });

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("startup model warmup failed for codex/gpt-5.4"),
    );
  });
});
