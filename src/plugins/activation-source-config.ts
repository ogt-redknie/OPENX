import {
  getRuntimeConfigSnapshot,
  getRuntimeConfigSourceSnapshot,
} from "../config/runtime-snapshot.js";
import type { OPNEXConfig } from "../config/types.opnex.js";

export function resolvePluginActivationSourceConfig(params: {
  config?: OPNEXConfig;
  activationSourceConfig?: OPNEXConfig;
}): OPNEXConfig {
  if (params.activationSourceConfig !== undefined) {
    return params.activationSourceConfig;
  }
  const sourceSnapshot = getRuntimeConfigSourceSnapshot();
  if (sourceSnapshot && params.config === getRuntimeConfigSnapshot()) {
    return sourceSnapshot;
  }
  return params.config ?? {};
}
