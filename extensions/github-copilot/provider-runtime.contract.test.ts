import { describeGithubCopilotProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeGithubCopilotProviderRuntimeContract(() => import("./index.js"));
