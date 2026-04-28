import type { HookInstallRecord } from "../config/types.hooks.js";
import type { OPNEXConfig } from "../config/types.opnex.js";

export type HookInstallUpdate = HookInstallRecord & { hookId: string };

export function recordHookInstall(cfg: OPNEXConfig, update: HookInstallUpdate): OPNEXConfig {
  const { hookId, ...record } = update;
  const installs = {
    ...cfg.hooks?.internal?.installs,
    [hookId]: {
      ...cfg.hooks?.internal?.installs?.[hookId],
      ...record,
      installedAt: record.installedAt ?? new Date().toISOString(),
    },
  };

  return {
    ...cfg,
    hooks: {
      ...cfg.hooks,
      internal: {
        ...cfg.hooks?.internal,
        installs: {
          ...installs,
          [hookId]: installs[hookId],
        },
      },
    },
  };
}
