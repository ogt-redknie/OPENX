import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";

export type IMessageAccountConfig = Omit<
  NonNullable<NonNullable<OPNEXConfig["channels"]>["imessage"]>,
  "accounts" | "defaultAccount"
>;
