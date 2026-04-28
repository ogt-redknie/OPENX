import type { MarkdownTableMode } from "./types.base.js";
import type { OPNEXConfig } from "./types.opnex.js";

export type ResolveMarkdownTableModeParams = {
  cfg?: Partial<OPNEXConfig>;
  channel?: string | null;
  accountId?: string | null;
};

export type ResolveMarkdownTableMode = (
  params: ResolveMarkdownTableModeParams,
) => MarkdownTableMode;
