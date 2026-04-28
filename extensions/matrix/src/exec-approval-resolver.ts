import { resolveApprovalOverGateway } from "opnex/plugin-sdk/approval-gateway-runtime";
import type { ExecApprovalReplyDecision } from "opnex/plugin-sdk/approval-runtime";
import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
import { isApprovalNotFoundError } from "opnex/plugin-sdk/error-runtime";

export { isApprovalNotFoundError };

export async function resolveMatrixApproval(params: {
  cfg: OPNEXConfig;
  approvalId: string;
  decision: ExecApprovalReplyDecision;
  senderId?: string | null;
  gatewayUrl?: string;
}): Promise<void> {
  await resolveApprovalOverGateway({
    cfg: params.cfg,
    approvalId: params.approvalId,
    decision: params.decision,
    senderId: params.senderId,
    gatewayUrl: params.gatewayUrl,
    clientDisplayName: `Matrix approval (${params.senderId?.trim() || "unknown"})`,
  });
}
