import {
  applyAgentDefaultModelPrimary,
  type OPNEXConfig,
} from "opnex/plugin-sdk/provider-onboard";

export const OPENCODE_GO_DEFAULT_MODEL_REF = "opencode-go/kimi-k2.6";

export function applyOpencodeGoProviderConfig(cfg: OPNEXConfig): OPNEXConfig {
  return cfg;
}

export function applyOpencodeGoConfig(cfg: OPNEXConfig): OPNEXConfig {
  return applyAgentDefaultModelPrimary(
    applyOpencodeGoProviderConfig(cfg),
    OPENCODE_GO_DEFAULT_MODEL_REF,
  );
}
