// Private runtime barrel for the bundled Twitch extension.
// Keep this barrel thin and aligned with the local extension surface.

export type {
  ChannelAccountSnapshot,
  ChannelCapabilities,
  ChannelGatewayContext,
  ChannelLogSink,
  ChannelMessageActionAdapter,
  ChannelMessageActionContext,
  ChannelMeta,
  ChannelOutboundAdapter,
  ChannelOutboundContext,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelStatusAdapter,
} from "opnex/plugin-sdk/channel-contract";
export type { ChannelPlugin } from "opnex/plugin-sdk/channel-core";
export type { OutboundDeliveryResult } from "opnex/plugin-sdk/channel-send-result";
export type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
export type { RuntimeEnv } from "opnex/plugin-sdk/runtime";
export type { WizardPrompter } from "opnex/plugin-sdk/setup";
