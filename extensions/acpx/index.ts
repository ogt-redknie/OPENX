import { tryDispatchAcpReplyHook } from "opnex/plugin-sdk/acp-runtime-backend";
import { createAcpxRuntimeService } from "./register.runtime.js";
import type { OPNEXPluginApi } from "./runtime-api.js";

const plugin = {
  id: "acpx",
  name: "ACPX Runtime",
  description: "Embedded ACP runtime backend with plugin-owned session and transport management.",
  register(api: OPNEXPluginApi) {
    api.registerService(
      createAcpxRuntimeService({
        pluginConfig: api.pluginConfig,
      }),
    );
    api.on("reply_dispatch", tryDispatchAcpReplyHook);
  },
};

export default plugin;
