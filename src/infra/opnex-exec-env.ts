export const OPNEX_CLI_ENV_VAR = "OPNEX_CLI";
export const OPNEX_CLI_ENV_VALUE = "1";

export function markOPNEXExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [OPNEX_CLI_ENV_VAR]: OPNEX_CLI_ENV_VALUE,
  };
}

export function ensureOPNEXExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[OPNEX_CLI_ENV_VAR] = OPNEX_CLI_ENV_VALUE;
  return env;
}
