import type { ProviderWrapStreamFnContext } from "opnex/plugin-sdk/plugin-entry";
import { createDeepSeekV4OpenAICompatibleThinkingWrapper } from "opnex/plugin-sdk/provider-stream-shared";

function isOpencodeGoDeepSeekV4ModelId(modelId: unknown): boolean {
  return modelId === "deepseek-v4-flash" || modelId === "deepseek-v4-pro";
}

export function createOpencodeGoDeepSeekV4Wrapper(
  baseStreamFn: ProviderWrapStreamFnContext["streamFn"],
  thinkingLevel: ProviderWrapStreamFnContext["thinkingLevel"],
): ProviderWrapStreamFnContext["streamFn"] {
  return createDeepSeekV4OpenAICompatibleThinkingWrapper({
    baseStreamFn,
    thinkingLevel,
    shouldPatchModel: (model) =>
      model.provider === "opencode-go" && isOpencodeGoDeepSeekV4ModelId(model.id),
  });
}
