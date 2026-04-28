import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";

export type WhatsAppAccountConfig = NonNullable<
  NonNullable<NonNullable<OPNEXConfig["channels"]>["whatsapp"]>["accounts"]
>[string];
