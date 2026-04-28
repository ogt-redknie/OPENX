import { describeVeniceProviderRuntimeContract } from "opnex/plugin-sdk/provider-test-contracts";

describeVeniceProviderRuntimeContract(() => import("./index.js"));
