// Private runtime barrel for the bundled Feishu extension.
// Keep this barrel thin and generic-only.

export type {
  AllowlistMatch,
  AnyAgentTool,
  BaseProbeResult,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelMeta,
  ChannelOutboundAdapter,
  ChannelPlugin,
  HistoryEntry,
  OPNEXConfig,
  OPNEXPluginApi,
  OutboundIdentity,
  PluginRuntime,
  ReplyPayload,
} from "opnex/plugin-sdk/core";
export type { OPNEXConfig as ClawdbotConfig } from "opnex/plugin-sdk/core";
export type { RuntimeEnv } from "opnex/plugin-sdk/runtime";
export type { GroupToolPolicyConfig } from "opnex/plugin-sdk/config-types";
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createActionGate,
  createDedupeCache,
} from "opnex/plugin-sdk/core";
export {
  PAIRING_APPROVED_MESSAGE,
  buildProbeChannelStatusSummary,
  createDefaultChannelRuntimeState,
} from "opnex/plugin-sdk/channel-status";
export { buildAgentMediaPayload } from "opnex/plugin-sdk/agent-media-payload";
export { createChannelPairingController } from "opnex/plugin-sdk/channel-pairing";
export { createReplyPrefixContext } from "opnex/plugin-sdk/channel-reply-pipeline";
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
  resolveChannelContextVisibilityMode,
} from "opnex/plugin-sdk/context-visibility-runtime";
export {
  loadSessionStore,
  resolveSessionStoreEntry,
} from "opnex/plugin-sdk/session-store-runtime";
export { readJsonFileWithFallback } from "opnex/plugin-sdk/json-store";
export { createPersistentDedupe } from "opnex/plugin-sdk/persistent-dedupe";
export { normalizeAgentId } from "opnex/plugin-sdk/routing";
export { chunkTextForOutbound } from "opnex/plugin-sdk/text-chunking";
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
} from "opnex/plugin-sdk/webhook-ingress";
export { setFeishuRuntime } from "./src/runtime.js";
