import type { Api, Model } from "@mariozechner/pi-ai";
import type { ModelRegistry } from "@mariozechner/pi-coding-agent";
import { resolveOPNEXAgentDir } from "../../agents/agent-paths.js";
import { listProfilesForProvider } from "../../agents/auth-profiles/profile-list.js";
import type { AuthProfileStore } from "../../agents/auth-profiles/types.js";
import {
  hasUsableCustomProviderApiKey,
  resolveAwsSdkEnvVarName,
  resolveEnvApiKey,
} from "../../agents/model-auth.js";
import {
  shouldSuppressBuiltInModel,
  shouldSuppressBuiltInModelFromManifest,
} from "../../agents/model-suppression.js";
import { discoverAuthStorage, discoverModels } from "../../agents/pi-model-discovery.js";
import type { OPNEXConfig } from "../../config/types.opnex.js";
import { resolveRuntimeSyntheticAuthProviderRefs } from "../../plugins/synthetic-auth.runtime.js";
import {
  formatErrorWithStack,
  MODEL_AVAILABILITY_UNAVAILABLE_CODE,
  shouldFallbackToAuthHeuristics,
} from "./list.errors.js";
import { toModelRow as toModelRowBase } from "./list.model-row.js";
import type { ModelRow } from "./list.types.js";
import { modelKey } from "./shared.js";

const hasAuthForProvider = (
  provider: string,
  cfg?: OPNEXConfig,
  authStore?: AuthProfileStore,
) => {
  if (!cfg || !authStore) {
    return false;
  }
  if (listProfilesForProvider(authStore, provider).length > 0) {
    return true;
  }
  if (provider === "amazon-bedrock" && resolveAwsSdkEnvVarName()) {
    return true;
  }
  if (resolveEnvApiKey(provider)) {
    return true;
  }
  if (hasUsableCustomProviderApiKey(cfg, provider)) {
    return true;
  }
  if (resolveRuntimeSyntheticAuthProviderRefs().includes(provider)) {
    return true;
  }
  return false;
};

function createAvailabilityUnavailableError(message: string): Error {
  const err = new Error(message);
  (err as { code?: string }).code = MODEL_AVAILABILITY_UNAVAILABLE_CODE;
  return err;
}

function normalizeAvailabilityError(err: unknown): Error {
  if (shouldFallbackToAuthHeuristics(err) && err instanceof Error) {
    return err;
  }
  return createAvailabilityUnavailableError(
    `Model availability unavailable: getAvailable() failed.\n${formatErrorWithStack(err)}`,
  );
}

function validateAvailableModels(availableModels: unknown): Model<Api>[] {
  if (!Array.isArray(availableModels)) {
    throw createAvailabilityUnavailableError(
      "Model availability unavailable: getAvailable() returned a non-array value.",
    );
  }

  for (const model of availableModels) {
    if (
      !model ||
      typeof model !== "object" ||
      typeof (model as { provider?: unknown }).provider !== "string" ||
      typeof (model as { id?: unknown }).id !== "string"
    ) {
      throw createAvailabilityUnavailableError(
        "Model availability unavailable: getAvailable() returned invalid model entries.",
      );
    }
  }

  return availableModels as Model<Api>[];
}

function loadAvailableModels(
  registry: ModelRegistry,
  cfg: OPNEXConfig,
  opts?: { runtimeSuppression?: boolean },
): Model<Api>[] {
  let availableModels: unknown;
  try {
    availableModels = registry.getAvailable();
  } catch (err) {
    throw normalizeAvailabilityError(err);
  }
  try {
    return validateAvailableModels(availableModels).filter((model) =>
      opts?.runtimeSuppression === false
        ? !shouldSuppressBuiltInModelFromManifest({
            provider: model.provider,
            id: model.id,
            config: cfg,
          })
        : !shouldSuppressBuiltInModel({
            provider: model.provider,
            id: model.id,
            baseUrl: model.baseUrl,
            config: cfg,
          }),
    );
  } catch (err) {
    throw normalizeAvailabilityError(err);
  }
}

export async function loadModelRegistry(
  cfg: OPNEXConfig,
  opts?: { providerFilter?: string; normalizeModels?: boolean },
) {
  const runtimeSuppression = opts?.normalizeModels !== false;
  const agentDir = resolveOPNEXAgentDir();
  const authStorage = discoverAuthStorage(agentDir, { readOnly: true });
  const registry = discoverModels(authStorage, agentDir, {
    providerFilter: opts?.providerFilter,
    normalizeModels: opts?.normalizeModels,
  });
  const models = registry.getAll().filter((model) =>
    runtimeSuppression
      ? !shouldSuppressBuiltInModel({
          provider: model.provider,
          id: model.id,
          baseUrl: model.baseUrl,
          config: cfg,
        })
      : !shouldSuppressBuiltInModelFromManifest({
          provider: model.provider,
          id: model.id,
          config: cfg,
        }),
  );
  let availableKeys: Set<string> | undefined;
  let availabilityErrorMessage: string | undefined;

  try {
    const availableModels = loadAvailableModels(registry, cfg, { runtimeSuppression });
    availableKeys = new Set(availableModels.map((model) => modelKey(model.provider, model.id)));
  } catch (err) {
    if (!shouldFallbackToAuthHeuristics(err)) {
      throw err;
    }

    // Some providers can report model-level availability as unavailable.
    // Fall back to provider-level auth heuristics when availability is undefined.
    availableKeys = undefined;
    if (!availabilityErrorMessage) {
      availabilityErrorMessage = formatErrorWithStack(err);
    }
  }
  return { registry, models, availableKeys, availabilityErrorMessage };
}

export function toModelRow(params: Parameters<typeof toModelRowBase>[0]): ModelRow {
  return toModelRowBase({
    ...params,
    hasAuthForProvider: ({ provider, cfg, authStore }) =>
      hasAuthForProvider(provider, cfg, authStore),
  });
}
