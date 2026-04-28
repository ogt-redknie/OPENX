export type { ChannelPlugin, OPNEXPluginApi, PluginRuntime } from "opnex/plugin-sdk/core";
export type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
export type {
  OPNEXPluginService,
  OPNEXPluginServiceContext,
  PluginLogger,
} from "opnex/plugin-sdk/core";
export type { ResolvedQQBotAccount, QQBotAccountConfig } from "./src/types.js";
export { getQQBotRuntime, setQQBotRuntime } from "./src/bridge/runtime.js";
