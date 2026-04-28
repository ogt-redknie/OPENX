import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OPNEXConfig } from "../../config/types.opnex.js";

const loadConfigMock = vi.fn<() => OPNEXConfig>();

vi.mock("../../config/config.js", async () => {
  const actual =
    await vi.importActual<typeof import("../../config/config.js")>("../../config/config.js");
  return {
    ...actual,
    getRuntimeConfig: () => loadConfigMock(),
  };
});

describe("agents_list tool", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    loadConfigMock.mockReset();
  });

  it("returns model and agent runtime metadata for allowed agents", async () => {
    loadConfigMock.mockReturnValue({
      agents: {
        defaults: {
          model: "anthropic/claude-opus-4.5",
          agentRuntime: { id: "pi", fallback: "pi" },
          subagents: { allowAgents: ["codex"] },
        },
        list: [
          { id: "main", default: true },
          {
            id: "codex",
            name: "Codex",
            model: "openai/gpt-5.5",
            agentRuntime: { id: "codex", fallback: "none" },
          },
        ],
      },
    } satisfies OPNEXConfig);

    const { createAgentsListTool } = await import("./agents-list-tool.js");
    const result = await createAgentsListTool({ agentSessionKey: "agent:main:main" }).execute(
      "call",
      {},
    );

    expect(result.details).toMatchObject({
      requester: "main",
      agents: [
        {
          id: "codex",
          name: "Codex",
          configured: true,
          model: "openai/gpt-5.5",
          agentRuntime: { id: "codex", fallback: "none", source: "agent" },
        },
      ],
    });
  });

  it("returns requester as the only target when no subagent allowlist is configured", async () => {
    loadConfigMock.mockReturnValue({
      agents: {
        list: [{ id: "main", default: true }, { id: "codex" }],
      },
    } satisfies OPNEXConfig);

    const { createAgentsListTool } = await import("./agents-list-tool.js");
    const result = await createAgentsListTool({ agentSessionKey: "agent:main:main" }).execute(
      "call",
      {},
    );

    expect(result.details).toMatchObject({
      requester: "main",
      allowAny: false,
      agents: [
        {
          id: "main",
          configured: true,
        },
      ],
    });
  });

  it("marks OPNEX_AGENT_RUNTIME as the effective runtime source", async () => {
    vi.stubEnv("OPNEX_AGENT_RUNTIME", "codex");
    loadConfigMock.mockReturnValue({
      agents: {
        defaults: {
          model: "openai/gpt-5.5",
        },
        list: [{ id: "main", default: true }],
      },
    } satisfies OPNEXConfig);

    const { createAgentsListTool } = await import("./agents-list-tool.js");
    const result = await createAgentsListTool({ agentSessionKey: "agent:main:main" }).execute(
      "call",
      {},
    );

    expect(result.details).toMatchObject({
      agents: [
        {
          id: "main",
          agentRuntime: { id: "codex", source: "env" },
        },
      ],
    });
  });
});
