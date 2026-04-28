import { readStringOrNumberParam, readStringParam } from "opnex/plugin-sdk/channel-actions";
import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";

export { resolveReactionMessageId } from "opnex/plugin-sdk/channel-actions";
export { handleWhatsAppAction } from "./action-runtime.js";
export { isWhatsAppGroupJid, normalizeWhatsAppTarget } from "./normalize.js";
export { readStringOrNumberParam, readStringParam, type OPNEXConfig };
