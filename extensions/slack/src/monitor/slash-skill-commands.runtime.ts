import { listSkillCommandsForAgents as listSkillCommandsForAgentsImpl } from "opnex/plugin-sdk/command-auth";

type ListSkillCommandsForAgents =
  typeof import("opnex/plugin-sdk/command-auth").listSkillCommandsForAgents;

export function listSkillCommandsForAgents(
  ...args: Parameters<ListSkillCommandsForAgents>
): ReturnType<ListSkillCommandsForAgents> {
  return listSkillCommandsForAgentsImpl(...args);
}
