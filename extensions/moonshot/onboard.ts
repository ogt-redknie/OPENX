import {
  createDefaultModelPresetAppliers,
  type OPNEXConfig,
} from "opnex/plugin-sdk/provider-onboard";
import {
  buildMoonshotProvider,
  MOONSHOT_BASE_URL,
  MOONSHOT_CN_BASE_URL,
  MOONSHOT_DEFAULT_MODEL_ID,
} from "./provider-catalog.js";
export const MOONSHOT_DEFAULT_MODEL_REF = `moonshot/${MOONSHOT_DEFAULT_MODEL_ID}`;

const moonshotPresetAppliers = createDefaultModelPresetAppliers<[string]>({
  primaryModelRef: MOONSHOT_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OPNEXConfig, baseUrl: string) => {
    const defaultModel = buildMoonshotProvider().models[0];
    if (!defaultModel) {
      return null;
    }

    return {
      providerId: "moonshot",
      api: "openai-completions",
      baseUrl,
      defaultModel,
      defaultModelId: MOONSHOT_DEFAULT_MODEL_ID,
      aliases: [{ modelRef: MOONSHOT_DEFAULT_MODEL_REF, alias: "Kimi" }],
    };
  },
});

export function applyMoonshotProviderConfig(cfg: OPNEXConfig): OPNEXConfig {
  return moonshotPresetAppliers.applyProviderConfig(cfg, MOONSHOT_BASE_URL);
}

export function applyMoonshotProviderConfigCn(cfg: OPNEXConfig): OPNEXConfig {
  return moonshotPresetAppliers.applyProviderConfig(cfg, MOONSHOT_CN_BASE_URL);
}

export function applyMoonshotConfig(cfg: OPNEXConfig): OPNEXConfig {
  return moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_BASE_URL);
}

export function applyMoonshotConfigCn(cfg: OPNEXConfig): OPNEXConfig {
  return moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_CN_BASE_URL);
}
