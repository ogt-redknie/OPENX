import {
  applyProviderConfigWithModelCatalogPreset,
  type OPNEXConfig,
} from "opnex/plugin-sdk/provider-onboard";
import { normalizeOptionalString } from "opnex/plugin-sdk/text-runtime";
import {
  buildZaiModelDefinition,
  resolveZaiBaseUrl,
  ZAI_DEFAULT_MODEL_ID,
} from "./model-definitions.js";

export const ZAI_DEFAULT_MODEL_REF = `zai/${ZAI_DEFAULT_MODEL_ID}`;

const ZAI_DEFAULT_MODELS = [
  buildZaiModelDefinition({ id: "glm-5.1" }),
  buildZaiModelDefinition({ id: "glm-5" }),
  buildZaiModelDefinition({ id: "glm-5-turbo" }),
  buildZaiModelDefinition({ id: "glm-5v-turbo" }),
  buildZaiModelDefinition({ id: "glm-4.7" }),
  buildZaiModelDefinition({ id: "glm-4.7-flash" }),
  buildZaiModelDefinition({ id: "glm-4.7-flashx" }),
  buildZaiModelDefinition({ id: "glm-4.6" }),
  buildZaiModelDefinition({ id: "glm-4.6v" }),
  buildZaiModelDefinition({ id: "glm-4.5" }),
  buildZaiModelDefinition({ id: "glm-4.5-air" }),
  buildZaiModelDefinition({ id: "glm-4.5-flash" }),
  buildZaiModelDefinition({ id: "glm-4.5v" }),
];

function resolveZaiPresetBaseUrl(cfg: OPNEXConfig, endpoint?: string): string {
  const existingProvider = cfg.models?.providers?.zai;
  const existingBaseUrl = normalizeOptionalString(existingProvider?.baseUrl) ?? "";
  return endpoint ? resolveZaiBaseUrl(endpoint) : existingBaseUrl || resolveZaiBaseUrl();
}

function applyZaiPreset(
  cfg: OPNEXConfig,
  params?: { endpoint?: string; modelId?: string },
  primaryModelRef?: string,
): OPNEXConfig {
  const modelId = normalizeOptionalString(params?.modelId) ?? ZAI_DEFAULT_MODEL_ID;
  const modelRef = `zai/${modelId}`;
  return applyProviderConfigWithModelCatalogPreset(cfg, {
    providerId: "zai",
    api: "openai-completions",
    baseUrl: resolveZaiPresetBaseUrl(cfg, params?.endpoint),
    catalogModels: ZAI_DEFAULT_MODELS,
    aliases: [{ modelRef, alias: "GLM" }],
    primaryModelRef,
  });
}

export function applyZaiProviderConfig(
  cfg: OPNEXConfig,
  params?: { endpoint?: string; modelId?: string },
): OPNEXConfig {
  return applyZaiPreset(cfg, params);
}

export function applyZaiConfig(
  cfg: OPNEXConfig,
  params?: { endpoint?: string; modelId?: string },
): OPNEXConfig {
  const modelId = normalizeOptionalString(params?.modelId) ?? ZAI_DEFAULT_MODEL_ID;
  const modelRef = modelId === ZAI_DEFAULT_MODEL_ID ? ZAI_DEFAULT_MODEL_REF : `zai/${modelId}`;
  return applyZaiPreset(cfg, params, modelRef);
}
