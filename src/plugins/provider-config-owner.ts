import { normalizeProviderId } from "../agents/provider-id.js";
import type { OPNEXConfig } from "../config/types.opnex.js";

export function resolveProviderConfigApiOwnerHint(params: {
  provider: string;
  config?: OPNEXConfig;
}): string | undefined {
  const providers = params.config?.models?.providers;
  if (!providers) {
    return undefined;
  }
  const normalizedProvider = normalizeProviderId(params.provider);
  if (!normalizedProvider) {
    return undefined;
  }
  const providerConfig =
    providers[params.provider] ??
    Object.entries(providers).find(
      ([candidateId]) => normalizeProviderId(candidateId) === normalizedProvider,
    )?.[1];
  const api =
    typeof providerConfig?.api === "string" ? normalizeProviderId(providerConfig.api) : "";
  if (!api || api === normalizedProvider) {
    return undefined;
  }
  return api;
}
