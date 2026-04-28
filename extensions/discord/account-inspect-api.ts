import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
import { inspectDiscordAccount } from "./src/account-inspect.js";

export function inspectDiscordReadOnlyAccount(cfg: OPNEXConfig, accountId?: string | null) {
  return inspectDiscordAccount({ cfg, accountId });
}
