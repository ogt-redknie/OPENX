export type MatrixManagedDeviceInfo = {
  deviceId: string;
  displayName: string | null;
  current: boolean;
};

export type MatrixDeviceHealthSummary = {
  currentDeviceId: string | null;
  staleOPNEXDevices: MatrixManagedDeviceInfo[];
  currentOPNEXDevices: MatrixManagedDeviceInfo[];
};

const OPNEX_DEVICE_NAME_PREFIX = "OPNEX ";

export function isOPNEXManagedMatrixDevice(displayName: string | null | undefined): boolean {
  return displayName?.startsWith(OPNEX_DEVICE_NAME_PREFIX) === true;
}

export function summarizeMatrixDeviceHealth(
  devices: MatrixManagedDeviceInfo[],
): MatrixDeviceHealthSummary {
  const currentDeviceId = devices.find((device) => device.current)?.deviceId ?? null;
  const opnexDevices = devices.filter((device) =>
    isOPNEXManagedMatrixDevice(device.displayName),
  );
  return {
    currentDeviceId,
    staleOPNEXDevices: opnexDevices.filter((device) => !device.current),
    currentOPNEXDevices: opnexDevices.filter((device) => device.current),
  };
}
