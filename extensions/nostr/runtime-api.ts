// Private runtime barrel for the bundled Nostr extension.
// Keep this barrel thin and aligned with the local extension surface.

export type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
export { getPluginRuntimeGatewayRequestScope } from "opnex/plugin-sdk/plugin-runtime";
export type { PluginRuntime } from "opnex/plugin-sdk/runtime-store";
