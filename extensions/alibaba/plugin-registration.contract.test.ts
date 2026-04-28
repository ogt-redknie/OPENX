import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "alibaba",
  videoGenerationProviderIds: ["alibaba"],
  requireGenerateVideo: true,
});
