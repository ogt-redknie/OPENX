import { Container } from "@buape/carbon";
import type { OPNEXConfig } from "opnex/plugin-sdk/config-types";
import { normalizeDiscordAccentColor, resolveDiscordAccentColor } from "./ui-colors.js";

export { normalizeDiscordAccentColor, resolveDiscordAccentColor } from "./ui-colors.js";

type DiscordContainerComponents = ConstructorParameters<typeof Container>[0];

export class DiscordUiContainer extends Container {
  constructor(params: {
    cfg: OPNEXConfig;
    accountId?: string | null;
    components?: DiscordContainerComponents;
    accentColor?: string;
    spoiler?: boolean;
  }) {
    const accentOverride = normalizeDiscordAccentColor(params.accentColor);
    const accentColor =
      accentOverride ?? resolveDiscordAccentColor({ cfg: params.cfg, accountId: params.accountId });
    super(params.components, { accentColor, spoiler: params.spoiler });
  }
}
