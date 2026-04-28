import type { OPNEXConfig } from "./runtime-api.js";
import { inspectTelegramAccount } from "./src/account-inspect.js";

export function inspectTelegramReadOnlyAccount(cfg: OPNEXConfig, accountId?: string | null) {
  return inspectTelegramAccount({ cfg, accountId });
}
