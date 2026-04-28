import { formatTrimmedAllowFromEntries } from "opnex/plugin-sdk/channel-config-helpers";
import type { ChannelStatusIssue } from "opnex/plugin-sdk/channel-contract";
import { PAIRING_APPROVED_MESSAGE } from "opnex/plugin-sdk/channel-status";
import {
  DEFAULT_ACCOUNT_ID,
  getChatChannelMeta,
  type ChannelPlugin,
  type OPNEXConfig,
} from "opnex/plugin-sdk/core";
import { resolveChannelMediaMaxBytes } from "opnex/plugin-sdk/media-runtime";
import { collectStatusIssuesFromLastError } from "opnex/plugin-sdk/status-helpers";
import {
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
} from "./config-accessors.js";
import { looksLikeIMessageTargetId, normalizeIMessageMessagingTarget } from "./normalize.js";
export { chunkTextForOutbound } from "opnex/plugin-sdk/text-chunking";

export {
  collectStatusIssuesFromLastError,
  DEFAULT_ACCOUNT_ID,
  formatTrimmedAllowFromEntries,
  getChatChannelMeta,
  looksLikeIMessageTargetId,
  normalizeIMessageMessagingTarget,
  PAIRING_APPROVED_MESSAGE,
  resolveChannelMediaMaxBytes,
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
};

export type { ChannelPlugin, ChannelStatusIssue, OPNEXConfig };
