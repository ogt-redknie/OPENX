import type { OPNEXConfig } from "../../config/types.js";

export type DirectoryConfigParams = {
  cfg: OPNEXConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
