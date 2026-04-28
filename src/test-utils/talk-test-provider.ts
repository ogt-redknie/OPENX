import type { OPNEXConfig } from "../config/types.opnex.js";

export const TALK_TEST_PROVIDER_ID = "acme-speech";
export const TALK_TEST_PROVIDER_LABEL = "Acme Speech";
export const TALK_TEST_PROVIDER_API_KEY_PATH = `talk.providers.${TALK_TEST_PROVIDER_ID}.apiKey`;
export const TALK_TEST_PROVIDER_API_KEY_PATH_SEGMENTS = [
  "talk",
  "providers",
  TALK_TEST_PROVIDER_ID,
  "apiKey",
] as const;

export function buildTalkTestProviderConfig(apiKey: unknown): OPNEXConfig {
  return {
    talk: {
      providers: {
        [TALK_TEST_PROVIDER_ID]: {
          apiKey,
        },
      },
    },
  } as OPNEXConfig;
}

export function readTalkTestProviderApiKey(config: OPNEXConfig): unknown {
  return config.talk?.providers?.[TALK_TEST_PROVIDER_ID]?.apiKey;
}
