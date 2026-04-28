import { describeAnthropicProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeAnthropicProviderRuntimeContract(() => import("./index.js"));
