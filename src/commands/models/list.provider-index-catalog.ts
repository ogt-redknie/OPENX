import type { OPNEXConfig } from "../../config/types.opnex.js";
import {
  loadOPNEXProviderIndex,
  normalizeModelCatalogProviderId,
  planProviderIndexModelCatalogRows,
} from "../../model-catalog/index.js";
import type { NormalizedModelCatalogRow } from "../../model-catalog/index.js";
import { normalizePluginsConfig, resolveEffectiveEnableState } from "../../plugins/config-state.js";

export function loadProviderIndexCatalogRowsForList(params: {
  providerFilter?: string;
  cfg: OPNEXConfig;
}): readonly NormalizedModelCatalogRow[] {
  const providerFilter = params.providerFilter
    ? normalizeModelCatalogProviderId(params.providerFilter)
    : undefined;
  const index = loadOPNEXProviderIndex();
  return planProviderIndexModelCatalogRows({
    index,
    ...(providerFilter ? { providerFilter } : {}),
  })
    .entries.filter(
      (entry) =>
        resolveEffectiveEnableState({
          id: entry.pluginId,
          origin: "bundled",
          config: normalizePluginsConfig(params.cfg.plugins),
          rootConfig: params.cfg,
          enabledByDefault: true,
        }).enabled,
    )
    .flatMap((entry) => entry.rows);
}
