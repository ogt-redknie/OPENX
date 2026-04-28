// Private runtime barrel for the bundled Nextcloud Talk extension.
// Keep this barrel thin and aligned with the local extension surface.

export type { AllowlistMatch } from "opnex/plugin-sdk/allow-from";
export type { ChannelGroupContext } from "opnex/plugin-sdk/channel-contract";
export { logInboundDrop } from "opnex/plugin-sdk/channel-logging";
export { createChannelPairingController } from "opnex/plugin-sdk/channel-pairing";
export {
  readStoreAllowFromForDmPolicy,
  resolveDmGroupAccessWithCommandGate,
} from "opnex/plugin-sdk/channel-policy";
export type {
  BlockStreamingCoalesceConfig,
  DmConfig,
  DmPolicy,
  GroupPolicy,
  GroupToolPolicyConfig,
  OPNEXConfig,
} from "opnex/plugin-sdk/config-types";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "opnex/plugin-sdk/runtime-group-policy";
export { dispatchInboundReplyWithBase } from "opnex/plugin-sdk/inbound-reply-dispatch";
export type { OutboundReplyPayload } from "opnex/plugin-sdk/reply-payload";
export { deliverFormattedTextWithAttachments } from "opnex/plugin-sdk/reply-payload";
export type { PluginRuntime } from "opnex/plugin-sdk/runtime-store";
export type { RuntimeEnv } from "opnex/plugin-sdk/runtime";
export type { SecretInput } from "opnex/plugin-sdk/secret-input";
export { fetchWithSsrFGuard } from "opnex/plugin-sdk/ssrf-runtime";
export { setNextcloudTalkRuntime } from "./src/runtime.js";
