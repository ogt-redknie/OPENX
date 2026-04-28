// Private OPNEX plugin helpers for bundled extensions.
// Keep this surface narrow and limited to the OPNEX workflow/tool contract.

export { definePluginEntry } from "./plugin-entry.js";
export {
  applyWindowsSpawnProgramPolicy,
  materializeWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
} from "./windows-spawn.js";
export type {
  AnyAgentTool,
  OPNEXPluginApi,
  OPNEXPluginToolContext,
  OPNEXPluginToolFactory,
} from "../plugins/types.js";
