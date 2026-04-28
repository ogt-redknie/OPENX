import type { ChannelDoctorConfigMutation } from "opnex/plugin-sdk/channel-contract";
import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
import { normalizeCompatibilityConfig as normalizeCompatibilityConfigImpl } from "./doctor.js";

export function normalizeCompatibilityConfig({
  cfg,
}: {
  cfg: OPNEXConfig;
}): ChannelDoctorConfigMutation {
  return normalizeCompatibilityConfigImpl({ cfg });
}
