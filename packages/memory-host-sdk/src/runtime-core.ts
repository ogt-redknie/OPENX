// Focused runtime contract for memory plugin config/state/helpers.

export type { AnyAgentTool } from "./host/opnex-runtime-agent.js";
export { resolveCronStyleNow } from "./host/opnex-runtime-agent.js";
export { DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR } from "./host/opnex-runtime-agent.js";
export { resolveDefaultAgentId, resolveSessionAgentId } from "./host/opnex-runtime-agent.js";
export { resolveMemorySearchConfig } from "./host/opnex-runtime-agent.js";
export {
  asToolParamsRecord,
  jsonResult,
  readNumberParam,
  readStringParam,
} from "./host/opnex-runtime-agent.js";
export { SILENT_REPLY_TOKEN } from "./host/opnex-runtime-session.js";
export { parseNonNegativeByteSize } from "./host/opnex-runtime-config.js";
export {
  getRuntimeConfig,
  /** @deprecated Use getRuntimeConfig(), or pass the already loaded config through the call path. */
  loadConfig,
} from "./host/opnex-runtime-config.js";
export { resolveStateDir } from "./host/opnex-runtime-config.js";
export { resolveSessionTranscriptsDirForAgent } from "./host/opnex-runtime-config.js";
export { emptyPluginConfigSchema } from "./host/opnex-runtime-memory.js";
export {
  buildActiveMemoryPromptSection,
  getMemoryCapabilityRegistration,
  listActiveMemoryPublicArtifacts,
} from "./host/opnex-runtime-memory.js";
export { parseAgentSessionKey } from "./host/opnex-runtime-agent.js";
export type { OPNEXConfig } from "./host/opnex-runtime-config.js";
export type { MemoryCitationsMode } from "./host/opnex-runtime-config.js";
export type {
  MemoryFlushPlan,
  MemoryFlushPlanResolver,
  MemoryPluginCapability,
  MemoryPluginPublicArtifact,
  MemoryPluginPublicArtifactsProvider,
  MemoryPluginRuntime,
  MemoryPromptSectionBuilder,
} from "./host/opnex-runtime-memory.js";
export type { OPNEXPluginApi } from "./host/opnex-runtime-memory.js";
