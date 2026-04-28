import { describe, expect, it } from "vitest";
import { isOPNEXManagedMatrixDevice, summarizeMatrixDeviceHealth } from "./device-health.js";

describe("matrix device health", () => {
  it("detects OPNEX-managed device names", () => {
    expect(isOPNEXManagedMatrixDevice("OPNEX Gateway")).toBe(true);
    expect(isOPNEXManagedMatrixDevice("OPNEX Debug")).toBe(true);
    expect(isOPNEXManagedMatrixDevice("Element iPhone")).toBe(false);
    expect(isOPNEXManagedMatrixDevice(null)).toBe(false);
  });

  it("summarizes stale OPNEX-managed devices separately from the current device", () => {
    const summary = summarizeMatrixDeviceHealth([
      {
        deviceId: "du314Zpw3A",
        displayName: "OPNEX Gateway",
        current: true,
      },
      {
        deviceId: "BritdXC6iL",
        displayName: "OPNEX Gateway",
        current: false,
      },
      {
        deviceId: "G6NJU9cTgs",
        displayName: "OPNEX Debug",
        current: false,
      },
      {
        deviceId: "phone123",
        displayName: "Element iPhone",
        current: false,
      },
    ]);

    expect(summary.currentDeviceId).toBe("du314Zpw3A");
    expect(summary.currentOPNEXDevices).toEqual([
      expect.objectContaining({ deviceId: "du314Zpw3A" }),
    ]);
    expect(summary.staleOPNEXDevices).toEqual([
      expect.objectContaining({ deviceId: "BritdXC6iL" }),
      expect.objectContaining({ deviceId: "G6NJU9cTgs" }),
    ]);
  });
});
