import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "opencode",
  providerIds: ["opencode"],
  mediaUnderstandingProviderIds: ["opencode"],
  requireDescribeImages: true,
});
