import {
  normalizeAccountId,
  resolveAccountEntry,
  type OPNEXConfig,
} from "opnex/plugin-sdk/account-core";
import type { TelegramAccountConfig } from "opnex/plugin-sdk/config-types";

export function resolveTelegramAccountConfig(
  cfg: OPNEXConfig,
  accountId: string,
): TelegramAccountConfig | undefined {
  const normalized = normalizeAccountId(accountId);
  return resolveAccountEntry(cfg.channels?.telegram?.accounts, normalized);
}

export function mergeTelegramAccountConfig(
  cfg: OPNEXConfig,
  accountId: string,
): TelegramAccountConfig {
  const {
    accounts: _ignored,
    defaultAccount: _ignoredDefaultAccount,
    groups: channelGroups,
    ...base
  } = (cfg.channels?.telegram ?? {}) as TelegramAccountConfig & {
    accounts?: unknown;
    defaultAccount?: unknown;
  };
  const account = resolveTelegramAccountConfig(cfg, accountId) ?? {};

  // Multi-account bots must not inherit channel-level groups unless explicitly set.
  const configuredAccountIds = Object.keys(cfg.channels?.telegram?.accounts ?? {});
  const isMultiAccount = configuredAccountIds.length > 1;
  const groups = account.groups ?? (isMultiAccount ? undefined : channelGroups);

  return { ...base, ...account, groups };
}
