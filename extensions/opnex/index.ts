import { definePluginEntry } from "opnex/plugin-sdk/plugin-entry";
import type { AnyAgentTool, OPNEXPluginApi, OPNEXPluginToolFactory } from "./runtime-api.js";
import { createOPNEXTool } from "./src/opnex-tool.js";

export default definePluginEntry({
  id: "opnex",
  name: "OPNEX",
  description: "Optional local shell helper tools",
  register(api: OPNEXPluginApi) {
    api.registerTool(
      ((ctx) => {
        if (ctx.sandboxed) {
          return null;
        }
        const taskFlow =
          api.runtime?.tasks.managedFlows && ctx.sessionKey
            ? api.runtime.tasks.managedFlows.fromToolContext(ctx)
            : undefined;
        return createOPNEXTool(api, { taskFlow }) as AnyAgentTool;
      }) as OPNEXPluginToolFactory,
      { optional: true },
    );
  },
});
