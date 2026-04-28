import { resolveChannelGroupRequireMention } from "opnex/plugin-sdk/channel-policy";
import type { OPNEXConfig } from "opnex/plugin-sdk/core";

type GoogleChatGroupContext = {
  cfg: OPNEXConfig;
  accountId?: string | null;
  groupId?: string | null;
};

export function resolveGoogleChatGroupRequireMention(params: GoogleChatGroupContext): boolean {
  return resolveChannelGroupRequireMention({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
