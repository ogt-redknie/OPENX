import { resolveAgentModelFallbackValues } from "../config/model-input.js";
import type { OPNEXConfig } from "../config/types.opnex.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
import type { ModelRef } from "./model-selection-normalize.js";
import {
  buildAllowedModelSetWithFallbacks,
  buildModelAliasIndex,
  getModelRefStatusWithFallbackModels,
  resolveAllowedModelRefFromAliasIndex,
  type ModelRefStatus,
} from "./model-selection-shared.js";

export {
  buildConfiguredAllowlistKeys,
  buildConfiguredModelCatalog,
  buildModelAliasIndex,
  inferUniqueProviderFromConfiguredModels,
  normalizeModelSelection,
  resolveConfiguredModelRef,
  resolveHooksGmailModel,
  resolveModelRefFromString,
} from "./model-selection-shared.js";
export type { ModelAliasIndex, ModelRefStatus } from "./model-selection-shared.js";

function resolveDefaultFallbackModels(cfg: OPNEXConfig): string[] {
  return resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
}

export function buildAllowedModelSet(params: {
  cfg: OPNEXConfig;
  catalog: ModelCatalogEntry[];
  defaultProvider: string;
  defaultModel?: string;
}): {
  allowAny: boolean;
  allowedCatalog: ModelCatalogEntry[];
  allowedKeys: Set<string>;
} {
  const { cfg, catalog, defaultProvider, defaultModel } = params;
  return buildAllowedModelSetWithFallbacks({
    cfg,
    catalog,
    defaultProvider,
    defaultModel,
    fallbackModels: resolveDefaultFallbackModels(cfg),
  });
}

export function getModelRefStatus(params: {
  cfg: OPNEXConfig;
  catalog: ModelCatalogEntry[];
  ref: ModelRef;
  defaultProvider: string;
  defaultModel?: string;
}): ModelRefStatus {
  const { cfg, catalog, ref, defaultProvider, defaultModel } = params;
  return getModelRefStatusWithFallbackModels({
    cfg,
    catalog,
    ref,
    defaultProvider,
    defaultModel,
    fallbackModels: resolveDefaultFallbackModels(cfg),
  });
}

export function resolveAllowedModelRef(params: {
  cfg: OPNEXConfig;
  catalog: ModelCatalogEntry[];
  raw: string;
  defaultProvider: string;
  defaultModel?: string;
}):
  | { ref: ModelRef; key: string }
  | {
      error: string;
    } {
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
  });
  return resolveAllowedModelRefFromAliasIndex({
    cfg: params.cfg,
    raw: params.raw,
    defaultProvider: params.defaultProvider,
    aliasIndex,
    getStatus: (ref) =>
      getModelRefStatus({
        cfg: params.cfg,
        catalog: params.catalog,
        ref,
        defaultProvider: params.defaultProvider,
        defaultModel: params.defaultModel,
      }),
  });
}
