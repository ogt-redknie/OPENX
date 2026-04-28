import type { OPNEXConfig } from "../config/types.opnex.js";
import { resolveManifestBuiltInModelSuppression } from "../plugins/manifest-model-suppression.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import { normalizeProviderId } from "./provider-id.js";

function resolveBuiltInModelSuppressionFromManifest(params: {
  provider?: string | null;
  id?: string | null;
  baseUrl?: string | null;
  config?: OPNEXConfig;
}) {
  const provider = normalizeProviderId(params.provider ?? "");
  const modelId = normalizeLowercaseStringOrEmpty(params.id);
  if (!provider || !modelId) {
    return undefined;
  }
  return resolveManifestBuiltInModelSuppression({
    provider,
    id: modelId,
    ...(params.config ? { config: params.config } : {}),
    ...(params.baseUrl ? { baseUrl: params.baseUrl } : {}),
    env: process.env,
  });
}

function resolveBuiltInModelSuppression(params: {
  provider?: string | null;
  id?: string | null;
  baseUrl?: string | null;
  config?: OPNEXConfig;
}) {
  const manifestResult = resolveBuiltInModelSuppressionFromManifest(params);
  if (manifestResult?.suppress) {
    return manifestResult;
  }
  const provider = normalizeProviderId(params.provider ?? "");
  const modelId = normalizeLowercaseStringOrEmpty(params.id);
  if (!provider || !modelId) {
    return undefined;
  }
  return undefined;
}

export function shouldSuppressBuiltInModelFromManifest(params: {
  provider?: string | null;
  id?: string | null;
  config?: OPNEXConfig;
}) {
  return resolveBuiltInModelSuppressionFromManifest(params)?.suppress ?? false;
}

export function shouldSuppressBuiltInModel(params: {
  provider?: string | null;
  id?: string | null;
  baseUrl?: string | null;
  config?: OPNEXConfig;
}) {
  return resolveBuiltInModelSuppression(params)?.suppress ?? false;
}

export function buildSuppressedBuiltInModelError(params: {
  provider?: string | null;
  id?: string | null;
  baseUrl?: string | null;
  config?: OPNEXConfig;
}): string | undefined {
  return resolveBuiltInModelSuppression(params)?.errorMessage;
}
