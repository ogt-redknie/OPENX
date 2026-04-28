import path from "node:path";
import { withTempHome as withTempHomeBase } from "opnex/plugin-sdk/test-env";
import type { OPNEXConfig } from "../config/types.opnex.js";

type AgentDefaultConfig = NonNullable<NonNullable<OPNEXConfig["agents"]>["defaults"]>;
type LoadConfigMock = {
  mockReturnValue(value: OPNEXConfig): unknown;
};

export async function withAgentCommandTempHome<T>(
  prefix: string,
  fn: (home: string) => Promise<T>,
): Promise<T> {
  return withTempHomeBase(fn, { prefix });
}

export function mockAgentCommandConfig(
  configSpy: LoadConfigMock,
  home: string,
  storePath: string,
  agentOverrides?: Partial<AgentDefaultConfig>,
): OPNEXConfig {
  const cfg = {
    agents: {
      defaults: {
        model: { primary: "anthropic/claude-opus-4-6" },
        models: { "anthropic/claude-opus-4-6": {} },
        workspace: path.join(home, "opnex"),
        ...agentOverrides,
      },
    },
    session: { store: storePath, mainKey: "main" },
  } as OPNEXConfig;
  configSpy.mockReturnValue(cfg);
  return cfg;
}

export function createDefaultAgentCommandResult() {
  return {
    payloads: [{ text: "ok" }],
    meta: {
      durationMs: 5,
      agentMeta: { sessionId: "s", provider: "p", model: "m" },
    },
  };
}
