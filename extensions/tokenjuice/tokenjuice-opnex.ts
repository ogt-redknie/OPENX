declare module "tokenjuice/opnex" {
  type OPNEXPiRuntime = {
    on(event: string, handler: (event: unknown, ctx: { cwd: string }) => unknown): void;
  };

  export function createTokenjuiceOPNEXEmbeddedExtension(): (pi: OPNEXPiRuntime) => void;
}
