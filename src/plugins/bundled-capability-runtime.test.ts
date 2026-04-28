import { describe, expect, it } from "vitest";
import { buildVitestCapabilityShimAliasMap } from "./bundled-capability-runtime.js";

describe("buildVitestCapabilityShimAliasMap", () => {
  it("keeps scoped and unscoped capability shim aliases aligned", () => {
    const aliasMap = buildVitestCapabilityShimAliasMap();

    expect(aliasMap["opnex/plugin-sdk/config-runtime"]).toBe(
      aliasMap["@opnex/plugin-sdk/config-runtime"],
    );
    expect(aliasMap["opnex/plugin-sdk/media-runtime"]).toBe(
      aliasMap["@opnex/plugin-sdk/media-runtime"],
    );
    expect(aliasMap["opnex/plugin-sdk/provider-onboard"]).toBe(
      aliasMap["@opnex/plugin-sdk/provider-onboard"],
    );
    expect(aliasMap["opnex/plugin-sdk/speech-core"]).toBe(
      aliasMap["@opnex/plugin-sdk/speech-core"],
    );
  });
});
