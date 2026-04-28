import type { PluginRuntime } from "opnex/plugin-sdk/core";
import { createPluginRuntimeStore } from "opnex/plugin-sdk/runtime-store";

const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } =
  createPluginRuntimeStore<PluginRuntime>({
    pluginId: "imessage",
    errorMessage: "iMessage runtime not initialized",
  });
export { getIMessageRuntime, setIMessageRuntime };
