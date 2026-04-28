import type { OPNEXConfig } from "../../config/types.opnex.js";
import type { HookClientIpConfig } from "./hooks-request-handler.js";

export function resolveHookClientIpConfig(cfg: OPNEXConfig): HookClientIpConfig {
  return {
    trustedProxies: cfg.gateway?.trustedProxies,
    allowRealIpFallback: cfg.gateway?.allowRealIpFallback === true,
  };
}
