import { definePluginEntry } from "opnex/plugin-sdk/plugin-entry";
import { normalizeLowercaseStringOrEmpty } from "opnex/plugin-sdk/text-runtime";

export default definePluginEntry({
  id: "acpx",
  name: "ACPX Setup",
  description: "Lightweight ACPX setup hooks",
  register(api) {
    api.registerAutoEnableProbe(({ config }) => {
      const backendRaw = normalizeLowercaseStringOrEmpty(config.acp?.backend);
      const configured =
        config.acp?.enabled === true ||
        config.acp?.dispatch?.enabled === true ||
        backendRaw === "acpx";
      return configured && (!backendRaw || backendRaw === "acpx") ? "ACP runtime configured" : null;
    });
  },
});
