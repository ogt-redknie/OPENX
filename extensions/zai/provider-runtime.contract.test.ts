import { describeZAIProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeZAIProviderRuntimeContract(() => import("./index.js"));
