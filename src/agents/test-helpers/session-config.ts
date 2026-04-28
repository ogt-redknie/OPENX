import type { OPNEXConfig } from "../../config/types.opnex.js";

export function createPerSenderSessionConfig(
  overrides: Partial<NonNullable<OPNEXConfig["session"]>> = {},
): NonNullable<OPNEXConfig["session"]> {
  return {
    mainKey: "main",
    scope: "per-sender",
    ...overrides,
  };
}
