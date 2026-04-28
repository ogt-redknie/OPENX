export const OPNEX_OWNER_ONLY_CORE_TOOL_NAMES = ["cron", "gateway", "nodes"] as const;

const OPNEX_OWNER_ONLY_CORE_TOOL_NAME_SET: ReadonlySet<string> = new Set(
  OPNEX_OWNER_ONLY_CORE_TOOL_NAMES,
);

export function isOPNEXOwnerOnlyCoreToolName(toolName: string): boolean {
  return OPNEX_OWNER_ONLY_CORE_TOOL_NAME_SET.has(toolName);
}
