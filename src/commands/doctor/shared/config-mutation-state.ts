import type { OPNEXConfig } from "../../../config/types.opnex.js";

export type DoctorConfigMutationState = {
  cfg: OPNEXConfig;
  candidate: OPNEXConfig;
  pendingChanges: boolean;
  fixHints: string[];
};

export type DoctorConfigMutationResult = {
  config: OPNEXConfig;
  changes: string[];
};

export function applyDoctorConfigMutation(params: {
  state: DoctorConfigMutationState;
  mutation: DoctorConfigMutationResult;
  shouldRepair: boolean;
  fixHint?: string;
}): DoctorConfigMutationState {
  if (params.mutation.changes.length === 0) {
    return params.state;
  }

  return {
    cfg: params.shouldRepair ? params.mutation.config : params.state.cfg,
    candidate: params.mutation.config,
    pendingChanges: true,
    fixHints:
      !params.shouldRepair && params.fixHint
        ? [...params.state.fixHints, params.fixHint]
        : params.state.fixHints,
  };
}
