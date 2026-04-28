import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "qwen",
  providerIds: ["qwen", "qwencloud", "modelstudio", "dashscope"],
  mediaUnderstandingProviderIds: ["qwen"],
  videoGenerationProviderIds: ["qwen"],
  requireDescribeImages: true,
  requireGenerateVideo: true,
});
