// Real workspace contract for memory engine foundation concerns.

export {
  resolveAgentContextLimits,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveDefaultAgentId,
  resolveSessionAgentId,
} from "./host/opnex-runtime-agent.js";
export {
  resolveMemorySearchConfig,
  resolveMemorySearchSyncConfig,
  type ResolvedMemorySearchConfig,
  type ResolvedMemorySearchSyncConfig,
} from "./host/opnex-runtime-agent.js";
export { parseDurationMs } from "./host/opnex-runtime-config.js";
export { loadConfig } from "./host/opnex-runtime-config.js";
export { resolveStateDir } from "./host/opnex-runtime-config.js";
export { resolveSessionTranscriptsDirForAgent } from "./host/opnex-runtime-config.js";
export {
  hasConfiguredSecretInput,
  normalizeResolvedSecretInputString,
} from "./host/opnex-runtime-config.js";
export { writeFileWithinRoot } from "./host/opnex-runtime-io.js";
export { createSubsystemLogger } from "./host/opnex-runtime-io.js";
export { detectMime } from "./host/opnex-runtime-io.js";
export { resolveGlobalSingleton } from "./host/opnex-runtime-io.js";
export { onSessionTranscriptUpdate } from "./host/opnex-runtime-session.js";
export { splitShellArgs } from "./host/opnex-runtime-io.js";
export { runTasksWithConcurrency } from "./host/opnex-runtime-io.js";
export {
  shortenHomeInString,
  shortenHomePath,
  resolveUserPath,
  truncateUtf16Safe,
} from "./host/opnex-runtime-io.js";
export type { OPNEXConfig } from "./host/opnex-runtime-config.js";
export type { SessionSendPolicyConfig } from "./host/opnex-runtime-config.js";
export type { SecretInput } from "./host/opnex-runtime-config.js";
export type {
  MemoryBackend,
  MemoryCitationsMode,
  MemoryQmdConfig,
  MemoryQmdIndexPath,
  MemoryQmdMcporterConfig,
  MemoryQmdSearchMode,
} from "./host/opnex-runtime-config.js";
export type { MemorySearchConfig } from "./host/opnex-runtime-config.js";
