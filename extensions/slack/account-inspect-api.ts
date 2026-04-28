import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
import { inspectSlackAccount } from "./src/account-inspect.js";

export function inspectSlackReadOnlyAccount(cfg: OPNEXConfig, accountId?: string | null) {
  return inspectSlackAccount({ cfg, accountId });
}
