import { expect } from "vitest";
import type { OPNEXConfig } from "../config/types.opnex.js";

export function expectGeneratedTokenPersistedToGatewayAuth(params: {
  generatedToken?: string;
  authToken?: string;
  persistedConfig?: OPNEXConfig;
}) {
  expect(params.generatedToken).toMatch(/^[0-9a-f]{48}$/);
  expect(params.authToken).toBe(params.generatedToken);
  expect(params.persistedConfig?.gateway?.auth?.mode).toBe("token");
  expect(params.persistedConfig?.gateway?.auth?.token).toBe(params.generatedToken);
}
