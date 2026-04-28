import { describeGoogleProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeGoogleProviderRuntimeContract(() => import("./index.js"));
