import type { OPNEXConfig } from "../../config/types.opnex.js";
import type { GetReplyOptions } from "../get-reply-options.types.js";
import type { ReplyPayload } from "../reply-payload.js";
import type { MsgContext } from "../templating.js";

export type GetReplyFromConfig = (
  ctx: MsgContext,
  opts?: GetReplyOptions,
  configOverride?: OPNEXConfig,
) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
