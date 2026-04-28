import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { FallbackAttempt } from "../agents/model-fallback.types.js";
import type { OPNEXConfig } from "../config/types.opnex.js";
import type {
  GeneratedImageAsset,
  ImageGenerationBackground,
  ImageGenerationIgnoredOverride,
  ImageGenerationNormalization,
  ImageGenerationOutputFormat,
  ImageGenerationProvider,
  ImageGenerationProviderOptions,
  ImageGenerationQuality,
  ImageGenerationResolution,
  ImageGenerationSourceImage,
} from "./types.js";

export type GenerateImageParams = {
  cfg: OPNEXConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
  providerOptions?: ImageGenerationProviderOptions;
};

export type GenerateImageRuntimeResult = {
  images: GeneratedImageAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  normalization?: ImageGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: ImageGenerationIgnoredOverride[];
};

export type ListRuntimeImageGenerationProvidersParams = {
  config?: OPNEXConfig;
};

export type RuntimeImageGenerationProvider = ImageGenerationProvider;
