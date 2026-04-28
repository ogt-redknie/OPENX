// Private runtime barrel for the bundled Google Chat extension.
// Keep this barrel thin and avoid broad plugin-sdk surfaces during bootstrap.

export { DEFAULT_ACCOUNT_ID } from "opnex/plugin-sdk/account-id";
export {
  createActionGate,
  jsonResult,
  readNumberParam,
  readReactionParams,
  readStringParam,
} from "opnex/plugin-sdk/channel-actions";
export { buildChannelConfigSchema } from "opnex/plugin-sdk/channel-config-primitives";
export type {
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
  ChannelStatusIssue,
} from "opnex/plugin-sdk/channel-contract";
export { missingTargetError } from "opnex/plugin-sdk/channel-feedback";
export {
  createAccountStatusSink,
  runPassiveAccountLifecycle,
} from "opnex/plugin-sdk/channel-lifecycle";
export { createChannelPairingController } from "opnex/plugin-sdk/channel-pairing";
export { createChannelReplyPipeline } from "opnex/plugin-sdk/channel-reply-pipeline";
export {
  evaluateGroupRouteAccessForPolicy,
  resolveDmGroupAccessWithLists,
  resolveSenderScopedGroupPolicy,
} from "opnex/plugin-sdk/channel-policy";
export { PAIRING_APPROVED_MESSAGE } from "opnex/plugin-sdk/channel-status";
export { chunkTextForOutbound } from "opnex/plugin-sdk/text-chunking";
export type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
export { GoogleChatConfigSchema } from "opnex/plugin-sdk/bundled-channel-config-schema";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "opnex/plugin-sdk/runtime-group-policy";
export { isDangerousNameMatchingEnabled } from "opnex/plugin-sdk/dangerous-name-runtime";
export { fetchRemoteMedia, resolveChannelMediaMaxBytes } from "opnex/plugin-sdk/media-runtime";
export { loadOutboundMediaFromUrl } from "opnex/plugin-sdk/outbound-media";
export type { PluginRuntime } from "opnex/plugin-sdk/runtime-store";
export { fetchWithSsrFGuard } from "opnex/plugin-sdk/ssrf-runtime";
export type { GoogleChatAccountConfig, GoogleChatConfig } from "opnex/plugin-sdk/config-types";
export { extractToolSend } from "opnex/plugin-sdk/tool-send";
export { resolveInboundMentionDecision } from "opnex/plugin-sdk/channel-inbound";
export { resolveInboundRouteEnvelopeBuilderWithRuntime } from "opnex/plugin-sdk/inbound-envelope";
export { resolveWebhookPath } from "opnex/plugin-sdk/webhook-path";
export {
  registerWebhookTargetWithPluginRoute,
  resolveWebhookTargetWithAuthOrReject,
  withResolvedWebhookRequestPipeline,
} from "opnex/plugin-sdk/webhook-targets";
export {
  createWebhookInFlightLimiter,
  readJsonWebhookBodyOrReject,
  type WebhookInFlightLimiter,
} from "opnex/plugin-sdk/webhook-request-guards";
export { setGoogleChatRuntime } from "./src/runtime.js";
