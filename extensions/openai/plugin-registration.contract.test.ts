import { pluginRegistrationContractCases } from "opnex/plugin-sdk/plugin-test-contracts";
import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  ...pluginRegistrationContractCases.openai,
  videoGenerationProviderIds: ["openai"],
  requireGenerateImage: true,
  requireGenerateVideo: true,
});
