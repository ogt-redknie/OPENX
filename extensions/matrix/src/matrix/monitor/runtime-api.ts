// Narrow Matrix monitor helper seam.
// Keep monitor internals off the broad package runtime-api barrel so monitor
// tests and shared workers do not pull unrelated Matrix helper surfaces.

export type { NormalizedLocation } from "opnex/plugin-sdk/channel-location";
export type { PluginRuntime, RuntimeLogger } from "opnex/plugin-sdk/plugin-runtime";
export type { BlockReplyContext, ReplyPayload } from "opnex/plugin-sdk/reply-runtime";
export type { MarkdownTableMode, OPNEXConfig } from "opnex/plugin-sdk/config-types";
export type { RuntimeEnv } from "opnex/plugin-sdk/runtime";
export {
  addAllowlistUserEntriesFromConfigEntry,
  buildAllowlistResolutionSummary,
  canonicalizeAllowlistWithResolvedIds,
  formatAllowlistMatchMeta,
  patchAllowlistUsersInConfigEntries,
  summarizeMapping,
} from "opnex/plugin-sdk/allow-from";
export {
  createReplyPrefixOptions,
  createTypingCallbacks,
} from "opnex/plugin-sdk/channel-reply-options-runtime";
export { formatLocationText, toLocationContext } from "opnex/plugin-sdk/channel-location";
export { getAgentScopedMediaLocalRoots } from "opnex/plugin-sdk/agent-media-payload";
export { logInboundDrop, logTypingFailure } from "opnex/plugin-sdk/channel-logging";
export { resolveAckReaction } from "opnex/plugin-sdk/channel-feedback";
export {
  buildChannelKeyCandidates,
  resolveChannelEntryMatch,
} from "opnex/plugin-sdk/channel-targets";
