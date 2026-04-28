import {
  createModelCatalogPresetAppliers,
  type OPNEXConfig,
} from "opnex/plugin-sdk/provider-onboard";
import {
  buildHuggingfaceModelDefinition,
  HUGGINGFACE_BASE_URL,
  HUGGINGFACE_MODEL_CATALOG,
} from "./models.js";

export const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";

const huggingfacePresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OPNEXConfig) => ({
    providerId: "huggingface",
    api: "openai-completions",
    baseUrl: HUGGINGFACE_BASE_URL,
    catalogModels: HUGGINGFACE_MODEL_CATALOG.map(buildHuggingfaceModelDefinition),
    aliases: [{ modelRef: HUGGINGFACE_DEFAULT_MODEL_REF, alias: "Hugging Face" }],
  }),
});

export function applyHuggingfaceProviderConfig(cfg: OPNEXConfig): OPNEXConfig {
  return huggingfacePresetAppliers.applyProviderConfig(cfg);
}

export function applyHuggingfaceConfig(cfg: OPNEXConfig): OPNEXConfig {
  return huggingfacePresetAppliers.applyConfig(cfg);
}
