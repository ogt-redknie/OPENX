const COMMON_LIVE_ENV_NAMES = [
  "OPNEX_AGENT_RUNTIME",
  "OPNEX_CONFIG_PATH",
  "OPNEX_GATEWAY_TOKEN",
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "OPNEX_SKIP_BROWSER_CONTROL_SERVER",
  "OPNEX_SKIP_CANVAS_HOST",
  "OPNEX_SKIP_CHANNELS",
  "OPNEX_SKIP_CRON",
  "OPNEX_SKIP_GMAIL_WATCHER",
  "OPNEX_STATE_DIR",
] as const;

export type LiveEnvSnapshot = Record<string, string | undefined>;

export function snapshotLiveEnv(extraNames: readonly string[] = []): LiveEnvSnapshot {
  const snapshot: LiveEnvSnapshot = {};
  for (const name of [...COMMON_LIVE_ENV_NAMES, ...extraNames]) {
    snapshot[name] = process.env[name];
  }
  return snapshot;
}

export function restoreLiveEnv(snapshot: LiveEnvSnapshot): void {
  for (const [name, value] of Object.entries(snapshot)) {
    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
}
