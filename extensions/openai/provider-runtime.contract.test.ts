import { describeOpenAIProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeOpenAIProviderRuntimeContract(() => import("./index.js"));
