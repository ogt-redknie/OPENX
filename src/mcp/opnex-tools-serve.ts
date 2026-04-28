/**
 * Standalone MCP server for selected built-in OPNEX tools.
 *
 * Run via: node --import tsx src/mcp/opnex-tools-serve.ts
 * Or: bun src/mcp/opnex-tools-serve.ts
 */
import { pathToFileURL } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { AnyAgentTool } from "../agents/tools/common.js";
import { createCronTool } from "../agents/tools/cron-tool.js";
import { formatErrorMessage } from "../infra/errors.js";
import { connectToolsMcpServerToStdio, createToolsMcpServer } from "./tools-stdio-server.js";

export function resolveOPNEXToolsForMcp(): AnyAgentTool[] {
  return [createCronTool()];
}

export function createOPNEXToolsMcpServer(
  params: {
    tools?: AnyAgentTool[];
  } = {},
): Server {
  const tools = params.tools ?? resolveOPNEXToolsForMcp();
  return createToolsMcpServer({ name: "opnex-tools", tools });
}

export async function serveOPNEXToolsMcp(): Promise<void> {
  const server = createOPNEXToolsMcpServer();
  await connectToolsMcpServerToStdio(server);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  serveOPNEXToolsMcp().catch((err) => {
    process.stderr.write(`opnex-tools-serve: ${formatErrorMessage(err)}\n`);
    process.exit(1);
  });
}
