import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getRuntimeConfig, type OPNEXConfig } from "../config/config.js";
import { VERSION } from "../version.js";
import { OPNEXChannelBridge } from "./channel-bridge.js";
import { ClaudePermissionRequestSchema, type ClaudeChannelMode } from "./channel-shared.js";
import { getChannelMcpCapabilities, registerChannelMcpTools } from "./channel-tools.js";

export { OPNEXChannelBridge } from "./channel-bridge.js";

export type OPNEXMcpServeOptions = {
  gatewayUrl?: string;
  gatewayToken?: string;
  gatewayPassword?: string;
  config?: OPNEXConfig;
  claudeChannelMode?: ClaudeChannelMode;
  verbose?: boolean;
};

export async function createOPNEXChannelMcpServer(opts: OPNEXMcpServeOptions = {}): Promise<{
  server: McpServer;
  bridge: OPNEXChannelBridge;
  start: () => Promise<void>;
  close: () => Promise<void>;
}> {
  const cfg = opts.config ?? getRuntimeConfig();
  const claudeChannelMode = opts.claudeChannelMode ?? "auto";
  const capabilities = getChannelMcpCapabilities(claudeChannelMode);
  const server = new McpServer(
    { name: "opnex", version: VERSION },
    capabilities ? { capabilities } : undefined,
  );
  const bridge = new OPNEXChannelBridge(cfg, {
    gatewayUrl: opts.gatewayUrl,
    gatewayToken: opts.gatewayToken,
    gatewayPassword: opts.gatewayPassword,
    claudeChannelMode,
    verbose: opts.verbose ?? false,
  });
  bridge.setServer(server);

  server.server.setNotificationHandler(ClaudePermissionRequestSchema, async ({ params }) => {
    await bridge.handleClaudePermissionRequest({
      requestId: params.request_id,
      toolName: params.tool_name,
      description: params.description,
      inputPreview: params.input_preview,
    });
  });
  registerChannelMcpTools(server, bridge);

  return {
    server,
    bridge,
    start: async () => {
      await bridge.start();
    },
    close: async () => {
      await bridge.close();
      await server.close();
    },
  };
}

export async function serveOPNEXChannelMcp(opts: OPNEXMcpServeOptions = {}): Promise<void> {
  const { server, start, close } = await createOPNEXChannelMcpServer(opts);
  const transport = new StdioServerTransport();

  let shuttingDown = false;
  let resolveClosed!: () => void;
  const closed = new Promise<void>((resolve) => {
    resolveClosed = resolve;
  });

  const shutdown = () => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    process.stdin.off("end", shutdown);
    process.stdin.off("close", shutdown);
    process.off("SIGINT", shutdown);
    process.off("SIGTERM", shutdown);
    transport["onclose"] = undefined;
    close().then(resolveClosed, resolveClosed);
  };

  transport["onclose"] = shutdown;
  process.stdin.once("end", shutdown);
  process.stdin.once("close", shutdown);
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  try {
    await server.connect(transport);
    await start();
    await closed;
  } finally {
    shutdown();
    await closed;
  }
}
