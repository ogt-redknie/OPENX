// Private runtime barrel for the bundled IRC extension.
// Keep this barrel thin and generic-only.

export type { BaseProbeResult } from "opnex/plugin-sdk/channel-contract";
export type { ChannelPlugin } from "opnex/plugin-sdk/channel-core";
export type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
export type { PluginRuntime } from "opnex/plugin-sdk/runtime-store";
export type { RuntimeEnv } from "opnex/plugin-sdk/runtime";
export type {
  BlockStreamingCoalesceConfig,
  DmConfig,
  DmPolicy,
  GroupPolicy,
  GroupToolPolicyBySenderConfig,
  GroupToolPolicyConfig,
  MarkdownConfig,
} from "opnex/plugin-sdk/config-types";
export type { OutboundReplyPayload } from "opnex/plugin-sdk/reply-payload";
export { DEFAULT_ACCOUNT_ID } from "opnex/plugin-sdk/account-id";
export { buildChannelConfigSchema } from "opnex/plugin-sdk/channel-config-primitives";
export {
  PAIRING_APPROVED_MESSAGE,
  buildBaseChannelStatusSummary,
} from "opnex/plugin-sdk/channel-status";
export { createChannelPairingController } from "opnex/plugin-sdk/channel-pairing";
export { createAccountStatusSink } from "opnex/plugin-sdk/channel-lifecycle";
export {
  readStoreAllowFromForDmPolicy,
  resolveEffectiveAllowFromLists,
} from "opnex/plugin-sdk/channel-policy";
export { resolveControlCommandGate } from "opnex/plugin-sdk/command-auth";
export { dispatchInboundReplyWithBase } from "opnex/plugin-sdk/inbound-reply-dispatch";
export { chunkTextForOutbound } from "opnex/plugin-sdk/text-chunking";
export {
  deliverFormattedTextWithAttachments,
  formatTextWithAttachmentLinks,
  resolveOutboundMediaUrls,
} from "opnex/plugin-sdk/reply-payload";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "opnex/plugin-sdk/runtime-group-policy";
export { isDangerousNameMatchingEnabled } from "opnex/plugin-sdk/dangerous-name-runtime";
export { logInboundDrop } from "opnex/plugin-sdk/channel-inbound";
