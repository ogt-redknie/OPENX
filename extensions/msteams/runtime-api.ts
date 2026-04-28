// Private runtime barrel for the bundled Microsoft Teams extension.
// Keep this barrel thin and aligned with the local extension surface.

export { DEFAULT_ACCOUNT_ID } from "opnex/plugin-sdk/account-id";
export type { AllowlistMatch } from "opnex/plugin-sdk/allow-from";
export {
  mergeAllowlist,
  resolveAllowlistMatchSimple,
  summarizeMapping,
} from "opnex/plugin-sdk/allow-from";
export type {
  BaseProbeResult,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelOutboundAdapter,
} from "opnex/plugin-sdk/channel-contract";
export type { ChannelPlugin } from "opnex/plugin-sdk/channel-core";
export { logTypingFailure } from "opnex/plugin-sdk/channel-logging";
export { createChannelPairingController } from "opnex/plugin-sdk/channel-pairing";
export {
  evaluateSenderGroupAccessForPolicy,
  readStoreAllowFromForDmPolicy,
  resolveDmGroupAccessWithLists,
  resolveEffectiveAllowFromLists,
  resolveSenderScopedGroupPolicy,
  resolveToolsBySender,
} from "opnex/plugin-sdk/channel-policy";
export { createChannelReplyPipeline } from "opnex/plugin-sdk/channel-reply-pipeline";
export {
  PAIRING_APPROVED_MESSAGE,
  buildProbeChannelStatusSummary,
  createDefaultChannelRuntimeState,
} from "opnex/plugin-sdk/channel-status";
export {
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveChannelEntryMatchWithFallback,
  resolveNestedAllowlistDecision,
} from "opnex/plugin-sdk/channel-targets";
export type {
  GroupPolicy,
  GroupToolPolicyConfig,
  MSTeamsChannelConfig,
  MSTeamsConfig,
  MSTeamsReplyStyle,
  MSTeamsTeamConfig,
  MarkdownTableMode,
  OPNEXConfig,
} from "opnex/plugin-sdk/config-types";
export { isDangerousNameMatchingEnabled } from "opnex/plugin-sdk/dangerous-name-runtime";
export { resolveDefaultGroupPolicy } from "opnex/plugin-sdk/runtime-group-policy";
export { withFileLock } from "opnex/plugin-sdk/file-lock";
export { keepHttpServerTaskAlive } from "opnex/plugin-sdk/channel-lifecycle";
export {
  detectMime,
  extensionForMime,
  extractOriginalFilename,
  getFileExtension,
  resolveChannelMediaMaxBytes,
} from "opnex/plugin-sdk/media-runtime";
export { dispatchReplyFromConfigWithSettledDispatcher } from "opnex/plugin-sdk/inbound-reply-dispatch";
export { loadOutboundMediaFromUrl } from "opnex/plugin-sdk/outbound-media";
export { buildMediaPayload } from "opnex/plugin-sdk/reply-payload";
export type { ReplyPayload } from "opnex/plugin-sdk/reply-payload";
export type { PluginRuntime } from "opnex/plugin-sdk/runtime-store";
export type { RuntimeEnv } from "opnex/plugin-sdk/runtime";
export type { SsrFPolicy } from "opnex/plugin-sdk/ssrf-runtime";
export { fetchWithSsrFGuard } from "opnex/plugin-sdk/ssrf-runtime";
export { normalizeStringEntries } from "opnex/plugin-sdk/string-normalization-runtime";
export { chunkTextForOutbound } from "opnex/plugin-sdk/text-chunking";
export { DEFAULT_WEBHOOK_MAX_BODY_BYTES } from "opnex/plugin-sdk/webhook-ingress";
export { setMSTeamsRuntime } from "./src/runtime.js";
