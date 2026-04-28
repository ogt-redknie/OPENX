import type { OPNEXConfig } from "../config/types.opnex.js";
import type { AuthProfileStore } from "./auth-profiles.js";

export const ANTHROPIC_STORE: AuthProfileStore = {
  version: 1,
  profiles: {
    "anthropic:default": {
      type: "api_key",
      provider: "anthropic",
      key: "sk-default",
    },
    "anthropic:work": {
      type: "api_key",
      provider: "anthropic",
      key: "sk-work",
    },
  },
};

export const ANTHROPIC_CFG: OPNEXConfig = {
  auth: {
    profiles: {
      "anthropic:default": { provider: "anthropic", mode: "api_key" },
      "anthropic:work": { provider: "anthropic", mode: "api_key" },
    },
  },
};
