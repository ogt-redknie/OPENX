import type { Api, Model } from "@mariozechner/pi-ai";
import type { ModelRegistry } from "@mariozechner/pi-coding-agent";
import { resolveOPNEXAgentDir } from "../../agents/agent-paths.js";
import { shouldSuppressBuiltInModel } from "../../agents/model-suppression.js";
import { discoverAuthStorage, discoverModels } from "../../agents/pi-model-discovery.js";
import type { OPNEXConfig } from "../../config/types.opnex.js";
import { loadModelRegistry } from "./list.registry.js";
import type { ConfiguredEntry } from "./list.types.js";
import { modelKey } from "./shared.js";

export async function loadListModelRegistry(
  cfg: OPNEXConfig,
  opts?: { providerFilter?: string; normalizeModels?: boolean },
) {
  const loaded = await loadModelRegistry(cfg, opts);
  return {
    ...loaded,
    discoveredKeys: new Set(loaded.models.map((model) => modelKey(model.provider, model.id))),
  };
}

function findConfiguredRegistryModel(params: {
  registry: ModelRegistry;
  entry: ConfiguredEntry;
  cfg: OPNEXConfig;
}): Model<Api> | undefined {
  const model = params.registry.find(params.entry.ref.provider, params.entry.ref.model);
  if (!model) {
    return undefined;
  }
  if (
    shouldSuppressBuiltInModel({
      provider: model.provider,
      id: model.id,
      baseUrl: model.baseUrl,
      config: params.cfg,
    })
  ) {
    return undefined;
  }
  return model;
}

export function loadConfiguredListModelRegistry(
  cfg: OPNEXConfig,
  entries: ConfiguredEntry[],
  opts?: { providerFilter?: string },
) {
  const agentDir = resolveOPNEXAgentDir();
  const authStorage = discoverAuthStorage(agentDir, { readOnly: true });
  const registry = discoverModels(authStorage, agentDir, {
    providerFilter: opts?.providerFilter,
  });
  const discoveredKeys = new Set<string>();
  const availableKeys = new Set<string>();

  for (const entry of entries) {
    const model = findConfiguredRegistryModel({ registry, entry, cfg });
    if (!model) {
      continue;
    }
    const key = modelKey(model.provider, model.id);
    discoveredKeys.add(key);
    if (registry.hasConfiguredAuth(model)) {
      availableKeys.add(key);
    }
  }

  return {
    registry,
    discoveredKeys,
    availableKeys,
  };
}
