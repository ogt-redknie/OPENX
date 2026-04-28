import type { OPNEXConfig } from "../../config/types.opnex.js";
import type { FinalizedMsgContext } from "../templating.js";

export type FastAbortResult = {
  handled: boolean;
  aborted: boolean;
  stoppedSubagents?: number;
};

export type TryFastAbortFromMessage = (params: {
  ctx: FinalizedMsgContext;
  cfg: OPNEXConfig;
}) => Promise<FastAbortResult>;

export type FormatAbortReplyText = (stoppedSubagents?: number) => string;
