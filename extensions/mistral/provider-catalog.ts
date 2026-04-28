import { buildManifestModelProviderConfig } from "opnex/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "opnex/plugin-sdk/provider-model-shared";
import manifest from "./opnex.plugin.json" with { type: "json" };

export function buildMistralProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: "mistral",
    catalog: manifest.modelCatalog.providers.mistral,
  });
}
