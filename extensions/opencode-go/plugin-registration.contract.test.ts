import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "opencode-go",
  providerIds: ["opencode-go"],
  mediaUnderstandingProviderIds: ["opencode-go"],
  requireDescribeImages: true,
});
