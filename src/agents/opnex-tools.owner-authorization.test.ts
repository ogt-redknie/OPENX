import { describe, expect, it } from "vitest";
import {
  isOPNEXOwnerOnlyCoreToolName,
  OPNEX_OWNER_ONLY_CORE_TOOL_NAMES,
} from "./tools/owner-only-tools.js";

describe("createOPNEXTools owner authorization", () => {
  it("marks owner-only core tool names", () => {
    expect(OPNEX_OWNER_ONLY_CORE_TOOL_NAMES).toEqual(["cron", "gateway", "nodes"]);
    expect(isOPNEXOwnerOnlyCoreToolName("cron")).toBe(true);
    expect(isOPNEXOwnerOnlyCoreToolName("gateway")).toBe(true);
    expect(isOPNEXOwnerOnlyCoreToolName("nodes")).toBe(true);
  });

  it("keeps canvas non-owner-only", () => {
    expect(isOPNEXOwnerOnlyCoreToolName("canvas")).toBe(false);
  });
});
