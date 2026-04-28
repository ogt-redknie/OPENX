import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanupTempDirs, makeTempDir } from "../test/helpers/temp-dir.js";
import {
  buildOPNEXCompileCacheRespawnPlan,
  isSourceCheckoutInstallRoot,
  resolveEntryInstallRoot,
  shouldEnableOPNEXCompileCache,
} from "./entry.compile-cache.js";

describe("entry compile cache", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    cleanupTempDirs(tempDirs);
  });

  it("resolves install roots from source and dist entry paths", () => {
    expect(resolveEntryInstallRoot("/repo/opnex/src/entry.ts")).toBe("/repo/opnex");
    expect(resolveEntryInstallRoot("/repo/opnex/dist/entry.js")).toBe("/repo/opnex");
    expect(resolveEntryInstallRoot("/pkg/opnex/entry.js")).toBe("/pkg/opnex");
  });

  it("treats git and source entry markers as source checkouts", async () => {
    const root = makeTempDir(tempDirs, "opnex-compile-cache-source-");
    await fs.writeFile(path.join(root, ".git"), "gitdir: .git/worktrees/opnex\n", "utf8");

    expect(isSourceCheckoutInstallRoot(root)).toBe(true);
  });

  it("disables compile cache for source-checkout installs", async () => {
    const root = makeTempDir(tempDirs, "opnex-compile-cache-src-entry-");
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "src", "entry.ts"), "export {};\n", "utf8");

    expect(
      shouldEnableOPNEXCompileCache({
        env: {},
        installRoot: root,
      }),
    ).toBe(false);
  });

  it("keeps compile cache enabled for packaged installs unless disabled by env", () => {
    const root = makeTempDir(tempDirs, "opnex-compile-cache-package-");

    expect(shouldEnableOPNEXCompileCache({ env: {}, installRoot: root })).toBe(true);
    expect(
      shouldEnableOPNEXCompileCache({
        env: { NODE_DISABLE_COMPILE_CACHE: "1" },
        installRoot: root,
      }),
    ).toBe(false);
  });

  it("builds a one-shot no-cache respawn plan when source checkout inherits NODE_COMPILE_CACHE", async () => {
    const root = makeTempDir(tempDirs, "opnex-compile-cache-respawn-");
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "src", "entry.ts"), "export {};\n", "utf8");

    const plan = buildOPNEXCompileCacheRespawnPlan({
      currentFile: path.join(root, "dist", "entry.js"),
      env: { NODE_COMPILE_CACHE: "/tmp/opnex-cache" },
      execArgv: ["--no-warnings"],
      execPath: "/usr/bin/node",
      installRoot: root,
      argv: ["/usr/bin/node", path.join(root, "dist", "entry.js"), "status", "--json"],
    });

    expect(plan).toEqual({
      command: "/usr/bin/node",
      args: ["--no-warnings", path.join(root, "dist", "entry.js"), "status", "--json"],
      env: {
        NODE_DISABLE_COMPILE_CACHE: "1",
        OPNEX_SOURCE_COMPILE_CACHE_RESPAWNED: "1",
      },
    });
  });

  it("does not respawn packaged installs when NODE_COMPILE_CACHE is configured", () => {
    const root = makeTempDir(tempDirs, "opnex-compile-cache-package-respawn-");

    expect(
      buildOPNEXCompileCacheRespawnPlan({
        currentFile: path.join(root, "dist", "entry.js"),
        env: { NODE_COMPILE_CACHE: "/tmp/opnex-cache" },
        installRoot: root,
      }),
    ).toBeUndefined();
  });

  it("does not respawn source checkouts twice", async () => {
    const root = makeTempDir(tempDirs, "opnex-compile-cache-respawn-once-");
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "src", "entry.ts"), "export {};\n", "utf8");

    expect(
      buildOPNEXCompileCacheRespawnPlan({
        currentFile: path.join(root, "dist", "entry.js"),
        env: {
          NODE_COMPILE_CACHE: "/tmp/opnex-cache",
          OPNEX_SOURCE_COMPILE_CACHE_RESPAWNED: "1",
        },
        installRoot: root,
      }),
    ).toBeUndefined();
  });
});
