import { buildManifestModelProviderConfig } from "opnex/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "opnex/plugin-sdk/provider-model-shared";
import manifest from "./opnex.plugin.json" with { type: "json" };

export function buildTogetherProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: "together",
    catalog: manifest.modelCatalog.providers.together,
  });
}
