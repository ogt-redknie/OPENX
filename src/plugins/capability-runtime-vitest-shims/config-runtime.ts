import { resolveActiveTalkProviderConfig } from "../../config/talk.js";
import type { OPNEXConfig } from "../../config/types.js";

export { resolveActiveTalkProviderConfig };

export function getRuntimeConfigSnapshot(): OPNEXConfig | null {
  return null;
}
