import type { OPNEXConfig } from "../config/types.opnex.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { AuthChoice, OnboardOptions } from "./onboard-types.js";

export type ApplyAuthChoiceParams = {
  authChoice: AuthChoice;
  config: OPNEXConfig;
  env?: NodeJS.ProcessEnv;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  agentDir?: string;
  setDefaultModel: boolean;
  preserveExistingDefaultModel?: boolean;
  agentId?: string;
  opts?: Partial<OnboardOptions>;
};

export type ApplyAuthChoiceResult = {
  config: OPNEXConfig;
  agentModelOverride?: string;
  retrySelection?: boolean;
};
