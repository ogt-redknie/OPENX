import type { OPNEXConfig } from "../../config/types.opnex.js";

export function makeModelFallbackCfg(overrides: Partial<OPNEXConfig> = {}): OPNEXConfig {
  return {
    agents: {
      defaults: {
        model: {
          primary: "openai/gpt-4.1-mini",
          fallbacks: ["anthropic/claude-haiku-3-5"],
        },
      },
    },
    ...overrides,
  } as OPNEXConfig;
}
