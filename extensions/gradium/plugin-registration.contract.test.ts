import { describePluginRegistrationContract } from "opnex/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "gradium",
  speechProviderIds: ["gradium"],
});
