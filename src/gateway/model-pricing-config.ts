import type { OPNEXConfig } from "../config/types.opnex.js";

export function isGatewayModelPricingEnabled(config: OPNEXConfig): boolean {
  return config.models?.pricing?.enabled !== false;
}
