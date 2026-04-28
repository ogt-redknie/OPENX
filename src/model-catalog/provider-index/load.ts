import { normalizeOPNEXProviderIndex } from "./normalize.js";
import { OPNEX_PROVIDER_INDEX } from "./opnex-provider-index.js";
import type { OPNEXProviderIndex } from "./types.js";

export function loadOPNEXProviderIndex(
  source: unknown = OPNEX_PROVIDER_INDEX,
): OPNEXProviderIndex {
  return normalizeOPNEXProviderIndex(source) ?? { version: 1, providers: {} };
}
