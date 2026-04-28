import type { OPNEXConfig as RuntimeApiOPNEXConfig } from "opnex/plugin-sdk/config-types";

export {
  DEFAULT_ACCOUNT_ID,
  getChatChannelMeta,
  type ChannelPlugin,
  type OPNEXConfig,
} from "opnex/plugin-sdk/core";
export { buildChannelConfigSchema, IMessageConfigSchema } from "./config-api.js";
export { PAIRING_APPROVED_MESSAGE } from "opnex/plugin-sdk/channel-status";
export {
  buildComputedAccountStatusSnapshot,
  collectStatusIssuesFromLastError,
} from "opnex/plugin-sdk/status-helpers";
export { formatTrimmedAllowFromEntries } from "opnex/plugin-sdk/channel-config-helpers";
export {
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
} from "./src/config-accessors.js";
export { looksLikeIMessageTargetId, normalizeIMessageMessagingTarget } from "./src/normalize.js";
export { resolveChannelMediaMaxBytes } from "opnex/plugin-sdk/media-runtime";
export {
  resolveIMessageGroupRequireMention,
  resolveIMessageGroupToolPolicy,
} from "./src/group-policy.js";

export { monitorIMessageProvider } from "./src/monitor.js";
export type { MonitorIMessageOpts } from "./src/monitor.js";
export { probeIMessage } from "./src/probe.js";
export type { IMessageProbe } from "./src/probe.js";
export { sendMessageIMessage } from "./src/send.js";
export { setIMessageRuntime } from "./src/runtime.js";
export { chunkTextForOutbound } from "./src/channel-api.js";
export type IMessageAccountConfig = Omit<
  NonNullable<NonNullable<RuntimeApiOPNEXConfig["channels"]>["imessage"]>,
  "accounts" | "defaultAccount"
>;
