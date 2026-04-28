// Private runtime barrel for the bundled Signal extension.
// Prefer narrower SDK subpaths plus local extension seams over the legacy signal barrel.

export type { ChannelMessageActionAdapter } from "opnex/plugin-sdk/channel-contract";
export { buildChannelConfigSchema, SignalConfigSchema } from "../config-api.js";
export { PAIRING_APPROVED_MESSAGE } from "opnex/plugin-sdk/channel-status";
import type { OPNEXConfig as RuntimeOPNEXConfig } from "opnex/plugin-sdk/config-types";
export type { RuntimeOPNEXConfig as OPNEXConfig };
export type { OPNEXPluginApi, PluginRuntime } from "opnex/plugin-sdk/core";
export type { ChannelPlugin } from "opnex/plugin-sdk/core";
export {
  DEFAULT_ACCOUNT_ID,
  applyAccountNameToChannelSection,
  deleteAccountFromConfigSection,
  emptyPluginConfigSchema,
  formatPairingApproveHint,
  getChatChannelMeta,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  setAccountEnabledInConfigSection,
} from "opnex/plugin-sdk/core";
export { resolveChannelMediaMaxBytes } from "opnex/plugin-sdk/media-runtime";
export { formatCliCommand, formatDocsLink } from "opnex/plugin-sdk/setup-tools";
export { chunkText } from "opnex/plugin-sdk/reply-runtime";
export { detectBinary } from "opnex/plugin-sdk/setup-tools";
export {
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
} from "opnex/plugin-sdk/runtime-group-policy";
export {
  buildBaseAccountStatusSnapshot,
  buildBaseChannelStatusSummary,
  collectStatusIssuesFromLastError,
  createDefaultChannelRuntimeState,
} from "opnex/plugin-sdk/status-helpers";
export { normalizeE164 } from "opnex/plugin-sdk/text-runtime";
export { looksLikeSignalTargetId, normalizeSignalMessagingTarget } from "./normalize.js";
export {
  listEnabledSignalAccounts,
  listSignalAccountIds,
  resolveDefaultSignalAccountId,
  resolveSignalAccount,
} from "./accounts.js";
export { monitorSignalProvider } from "./monitor.js";
export { installSignalCli } from "./install-signal-cli.js";
export { probeSignal } from "./probe.js";
export { resolveSignalReactionLevel } from "./reaction-level.js";
export { removeReactionSignal, sendReactionSignal } from "./send-reactions.js";
export { sendMessageSignal } from "./send.js";
export { signalMessageActions } from "./message-actions.js";
export type { ResolvedSignalAccount } from "./accounts.js";
export type { SignalAccountConfig } from "./account-types.js";
