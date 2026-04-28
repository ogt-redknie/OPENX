import type {
  ChannelAccountSnapshot,
  ChannelRuntimeSurface,
} from "opnex/plugin-sdk/channel-contract";
import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
import type { RuntimeEnv } from "opnex/plugin-sdk/runtime-env";

export type MonitorTelegramOpts = {
  token?: string;
  accountId?: string;
  config?: OPNEXConfig;
  runtime?: RuntimeEnv;
  channelRuntime?: ChannelRuntimeSurface;
  abortSignal?: AbortSignal;
  useWebhook?: boolean;
  webhookPath?: string;
  webhookPort?: number;
  webhookSecret?: string;
  webhookHost?: string;
  proxyFetch?: typeof fetch;
  webhookUrl?: string;
  webhookCertPath?: string;
  setStatus?: (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
};

export type TelegramMonitorFn = (opts?: MonitorTelegramOpts) => Promise<void>;
