import { buildManifestModelProviderConfig } from "opnex/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "opnex/plugin-sdk/provider-model-shared";
import manifest from "./opnex.plugin.json" with { type: "json" };

export function buildNvidiaProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: "nvidia",
    catalog: manifest.modelCatalog.providers.nvidia,
  });
}
