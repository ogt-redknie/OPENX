import type { OPNEXConfig } from "../../config/types.opnex.js";
import type { RuntimeEnv } from "../../runtime.js";

export type ChannelPairingAdapter = {
  idLabel: string;
  normalizeAllowEntry?: (entry: string) => string;
  notifyApproval?: (params: {
    cfg: OPNEXConfig;
    id: string;
    accountId?: string;
    runtime?: RuntimeEnv;
  }) => Promise<void>;
};
