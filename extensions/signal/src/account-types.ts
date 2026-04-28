import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";

export type SignalAccountConfig = Omit<
  Exclude<NonNullable<OPNEXConfig["channels"]>["signal"], undefined>,
  "accounts"
>;
