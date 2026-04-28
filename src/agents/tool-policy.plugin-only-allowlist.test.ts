import { describe, expect, it } from "vitest";
import {
  analyzeAllowlistByToolType,
  buildPluginToolGroups,
  type PluginToolGroups,
} from "./tool-policy.js";

const pluginGroups: PluginToolGroups = {
  all: ["opnex", "workflow_tool"],
  byPlugin: new Map([["opnex", ["opnex", "workflow_tool"]]]),
};
const coreTools = new Set(["read", "write", "exec", "session_status"]);

describe("analyzeAllowlistByToolType", () => {
  it("preserves allowlist when it only targets plugin tools", () => {
    const policy = analyzeAllowlistByToolType({ allow: ["opnex"] }, pluginGroups, coreTools);
    expect(policy.policy?.allow).toEqual(["opnex"]);
    expect(policy.pluginOnlyAllowlist).toBe(true);
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it("preserves allowlist when it only targets plugin groups", () => {
    const policy = analyzeAllowlistByToolType(
      { allow: ["group:plugins"] },
      pluginGroups,
      coreTools,
    );
    expect(policy.policy?.allow).toEqual(["group:plugins"]);
    expect(policy.pluginOnlyAllowlist).toBe(true);
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it('keeps allowlist when it uses "*"', () => {
    const policy = analyzeAllowlistByToolType({ allow: ["*"] }, pluginGroups, coreTools);
    expect(policy.policy?.allow).toEqual(["*"]);
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it("keeps allowlist when it mixes plugin and core entries", () => {
    const policy = analyzeAllowlistByToolType(
      { allow: ["opnex", "read"] },
      pluginGroups,
      coreTools,
    );
    expect(policy.policy?.allow).toEqual(["opnex", "read"]);
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it("preserves allowlist with unknown entries when no core tools match", () => {
    const emptyPlugins: PluginToolGroups = { all: [], byPlugin: new Map() };
    const policy = analyzeAllowlistByToolType({ allow: ["opnex"] }, emptyPlugins, coreTools);
    expect(policy.policy?.allow).toEqual(["opnex"]);
    expect(policy.pluginOnlyAllowlist).toBe(false);
    expect(policy.unknownAllowlist).toEqual(["opnex"]);
  });

  it("keeps allowlist with core tools and reports unknown entries", () => {
    const emptyPlugins: PluginToolGroups = { all: [], byPlugin: new Map() };
    const policy = analyzeAllowlistByToolType(
      { allow: ["read", "opnex"] },
      emptyPlugins,
      coreTools,
    );
    expect(policy.policy?.allow).toEqual(["read", "opnex"]);
    expect(policy.unknownAllowlist).toEqual(["opnex"]);
  });

  it("does not mark unavailable core entries as plugin-only", () => {
    const policy = analyzeAllowlistByToolType({ allow: ["apply_patch"] }, pluginGroups, coreTools);
    expect(policy.pluginOnlyAllowlist).toBe(false);
    expect(policy.unknownAllowlist).toEqual(["apply_patch"]);
  });

  it("ignores empty plugin ids when building groups", () => {
    const groups = buildPluginToolGroups({
      tools: [{ name: "opnex" }],
      toolMeta: () => ({ pluginId: "" }),
    });
    expect(groups.all).toEqual(["opnex"]);
    expect(groups.byPlugin.size).toBe(0);
  });
});
