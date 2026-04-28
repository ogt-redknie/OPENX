// Private runtime barrel for the bundled Voice Call extension.
// Keep this barrel thin and aligned with the local extension surface.

export { definePluginEntry } from "opnex/plugin-sdk/plugin-entry";
export type { OPNEXPluginApi } from "opnex/plugin-sdk/plugin-entry";
export type { GatewayRequestHandlerOptions } from "opnex/plugin-sdk/gateway-runtime";
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
} from "opnex/plugin-sdk/webhook-request-guards";
export { fetchWithSsrFGuard, isBlockedHostnameOrIp } from "opnex/plugin-sdk/ssrf-runtime";
export type { SessionEntry } from "opnex/plugin-sdk/session-store-runtime";
export {
  TtsAutoSchema,
  TtsConfigSchema,
  TtsModeSchema,
  TtsProviderSchema,
} from "opnex/plugin-sdk/tts-runtime";
export { sleep } from "opnex/plugin-sdk/runtime-env";
