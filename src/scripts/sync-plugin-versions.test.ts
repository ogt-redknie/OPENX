import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { syncPluginVersions } from "../../scripts/sync-plugin-versions.js";
import { cleanupTempDirs, makeTempDir } from "../../test/helpers/temp-dir.js";

const tempDirs: string[] = [];

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

describe("syncPluginVersions", () => {
  afterEach(() => {
    cleanupTempDirs(tempDirs);
  });

  it("preserves workspace opnex devDependencies and plugin host floors", () => {
    const rootDir = makeTempDir(tempDirs, "opnex-sync-plugin-versions-");

    writeJson(path.join(rootDir, "package.json"), {
      name: "opnex",
      version: "2026.4.1",
    });
    writeJson(path.join(rootDir, "extensions/bluebubbles/package.json"), {
      name: "@opnex/bluebubbles",
      version: "2026.3.30",
      devDependencies: {
        opnex: "workspace:*",
      },
      peerDependencies: {
        opnex: ">=2026.3.30",
      },
      opnex: {
        install: {
          minHostVersion: ">=2026.3.30",
        },
        compat: {
          pluginApi: ">=2026.3.30",
        },
        build: {
          opnexVersion: "2026.3.30",
        },
      },
    });

    const summary = syncPluginVersions(rootDir);
    const updatedPackage = JSON.parse(
      fs.readFileSync(path.join(rootDir, "extensions/bluebubbles/package.json"), "utf8"),
    ) as {
      version?: string;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      opnex?: {
        install?: {
          minHostVersion?: string;
        };
        compat?: {
          pluginApi?: string;
        };
        build?: {
          opnexVersion?: string;
        };
      };
    };

    expect(summary.updated).toContain("@opnex/bluebubbles");
    expect(updatedPackage.version).toBe("2026.4.1");
    expect(updatedPackage.devDependencies?.opnex).toBe("workspace:*");
    expect(updatedPackage.peerDependencies?.opnex).toBe(">=2026.4.1");
    expect(updatedPackage.opnex?.install?.minHostVersion).toBe(">=2026.3.30");
    expect(updatedPackage.opnex?.compat?.pluginApi).toBe(">=2026.4.1");
    expect(updatedPackage.opnex?.build?.opnexVersion).toBe("2026.4.1");
  });
});
