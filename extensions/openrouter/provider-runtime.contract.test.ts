import { describeOpenRouterProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeOpenRouterProviderRuntimeContract(() => import("./index.js"));
