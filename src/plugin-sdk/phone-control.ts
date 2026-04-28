// Narrow plugin-sdk surface for the bundled phone-control plugin.
// Keep this list additive and scoped to the bundled phone-control surface.

export { definePluginEntry } from "./plugin-entry.js";
export type {
  OPNEXPluginApi,
  OPNEXPluginCommandDefinition,
  OPNEXPluginService,
  PluginCommandContext,
} from "../plugins/types.js";
