import { getRuntimeConfig, type OPNEXConfig } from "../config/config.js";

export function loadBrowserConfigForRuntimeRefresh(): OPNEXConfig {
  return getRuntimeConfig();
}
