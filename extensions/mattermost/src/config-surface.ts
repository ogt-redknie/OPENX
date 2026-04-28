import { buildChannelConfigSchema } from "opnex/plugin-sdk/channel-config-primitives";
import { MattermostConfigSchema } from "./config-schema-core.js";

export const MattermostChannelConfigSchema = buildChannelConfigSchema(MattermostConfigSchema);
