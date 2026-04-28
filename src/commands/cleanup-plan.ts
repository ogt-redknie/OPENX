import {
  getRuntimeConfig,
  resolveConfigPath,
  resolveOAuthDir,
  resolveStateDir,
} from "../config/config.js";
import type { OPNEXConfig } from "../config/types.opnex.js";
import { buildCleanupPlan } from "./cleanup-utils.js";

export function resolveCleanupPlanFromDisk(): {
  cfg: OPNEXConfig;
  stateDir: string;
  configPath: string;
  oauthDir: string;
  configInsideState: boolean;
  oauthInsideState: boolean;
  workspaceDirs: string[];
} {
  const cfg = getRuntimeConfig();
  const stateDir = resolveStateDir();
  const configPath = resolveConfigPath();
  const oauthDir = resolveOAuthDir();
  const plan = buildCleanupPlan({ cfg, stateDir, configPath, oauthDir });
  return { cfg, stateDir, configPath, oauthDir, ...plan };
}
