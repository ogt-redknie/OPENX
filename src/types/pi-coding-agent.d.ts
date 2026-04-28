export type OPNEXPiCodingAgentSkillSourceAugmentation = never;

declare module "@mariozechner/pi-coding-agent" {
  interface Skill {
    // OPNEX relies on the source identifier returned by pi skill loaders.
    source: string;
  }
}
