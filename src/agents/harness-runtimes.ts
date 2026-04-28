import type { OPNEXConfig } from "../config/types.opnex.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import { isRecord } from "../utils.js";
import { resolveAgentRuntimePolicy } from "./agent-runtime-policy.js";

export function collectConfiguredAgentHarnessRuntimes(
  config: OPNEXConfig,
  env: NodeJS.ProcessEnv,
): string[] {
  const runtimes = new Set<string>();
  const pushRuntime = (value: unknown) => {
    if (typeof value !== "string") {
      return;
    }
    const normalized = normalizeOptionalLowercaseString(value);
    if (!normalized || normalized === "auto" || normalized === "pi") {
      return;
    }
    runtimes.add(normalized);
  };

  pushRuntime(resolveAgentRuntimePolicy(config.agents?.defaults)?.id);
  if (Array.isArray(config.agents?.list)) {
    for (const agent of config.agents.list) {
      if (!isRecord(agent)) {
        continue;
      }
      pushRuntime(resolveAgentRuntimePolicy(agent)?.id);
    }
  }
  pushRuntime(env.OPNEX_AGENT_RUNTIME);

  return [...runtimes].toSorted((left, right) => left.localeCompare(right));
}
