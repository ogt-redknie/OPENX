import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";

export function makeQqbotSecretRefConfig(): OPNEXConfig {
  return {
    channels: {
      qqbot: {
        appId: "123456",
        clientSecret: {
          source: "env",
          provider: "default",
          id: "QQBOT_CLIENT_SECRET",
        },
      },
    },
  } as OPNEXConfig;
}

export function makeQqbotDefaultAccountConfig(): OPNEXConfig {
  return {
    channels: {
      qqbot: {
        defaultAccount: "bot2",
        accounts: {
          bot2: { appId: "123456" },
        },
      },
    },
  } as OPNEXConfig;
}
