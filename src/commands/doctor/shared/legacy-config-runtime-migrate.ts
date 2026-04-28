import type { OPNEXConfig } from "../../../config/types.opnex.js";
import { normalizeBaseCompatibilityConfigValues } from "./legacy-config-compatibility-base.js";

export function normalizeRuntimeCompatibilityConfigValues(cfg: OPNEXConfig): {
  config: OPNEXConfig;
  changes: string[];
} {
  const changes: string[] = [];
  const next = normalizeBaseCompatibilityConfigValues(cfg, changes);
  return { config: next, changes };
}
