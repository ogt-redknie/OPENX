import { pluginRegistrationContractCases } from "opnex/plugin-sdk/plugin-test-contracts";
import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  ...pluginRegistrationContractCases.google,
  speechProviderIds: ["google"],
  videoGenerationProviderIds: ["google"],
  webSearchProviderIds: ["gemini"],
  requireDescribeImages: true,
  requireGenerateImage: true,
  requireGenerateVideo: true,
});
