import type { PluginRuntime } from "opnex/plugin-sdk/core";
import { createPluginRuntimeStore } from "opnex/plugin-sdk/runtime-store";

const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } =
  createPluginRuntimeStore<PluginRuntime>({
    pluginId: "zalouser",
    errorMessage: "Zalouser runtime not initialized",
  });
export { getZalouserRuntime, setZalouserRuntime };
