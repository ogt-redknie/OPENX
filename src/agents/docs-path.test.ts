import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveOPNEXDocsPath,
  resolveOPNEXReferencePaths,
  resolveOPNEXSourcePath,
} from "./docs-path.js";

async function makePackageRoot(prefix: string): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  await fs.writeFile(path.join(root, "package.json"), '{"name":"opnex"}\n');
  return root;
}

async function writeDocsJson(root: string): Promise<void> {
  await fs.mkdir(path.join(root, "docs"), { recursive: true });
  await fs.writeFile(path.join(root, "docs", "docs.json"), "{}\n");
}

describe("resolveOPNEXDocsPath", () => {
  it("uses the workspace docs directory when it has canonical docs metadata", async () => {
    const root = await makePackageRoot("opnex-docs-workspace-");
    await writeDocsJson(root);

    await expect(resolveOPNEXDocsPath({ workspaceDir: root })).resolves.toBe(
      path.join(root, "docs"),
    );
  });

  it("finds bundled package docs from a nested package path", async () => {
    const root = await makePackageRoot("opnex-docs-package-");
    await writeDocsJson(root);
    const nested = path.join(root, "dist", "agents");
    await fs.mkdir(nested, { recursive: true });

    await expect(resolveOPNEXDocsPath({ cwd: nested })).resolves.toBe(path.join(root, "docs"));
  });

  it("does not accept incomplete template-only docs directories", async () => {
    const root = await makePackageRoot("opnex-docs-incomplete-");
    await fs.mkdir(path.join(root, "docs", "reference", "templates"), { recursive: true });

    await expect(resolveOPNEXDocsPath({ cwd: root })).resolves.toBeNull();
  });
});

describe("resolveOPNEXSourcePath", () => {
  it("returns the package root only for git checkouts", async () => {
    const root = await makePackageRoot("opnex-source-git-");
    await fs.mkdir(path.join(root, ".git"));

    await expect(resolveOPNEXSourcePath({ cwd: root })).resolves.toBe(root);
  });

  it("omits source path for npm-style package installs", async () => {
    const root = await makePackageRoot("opnex-source-npm-");

    await expect(resolveOPNEXSourcePath({ cwd: root })).resolves.toBeNull();
  });
});

describe("resolveOPNEXReferencePaths", () => {
  it("returns docs and local source together for git checkouts", async () => {
    const root = await makePackageRoot("opnex-reference-git-");
    await writeDocsJson(root);
    await fs.mkdir(path.join(root, ".git"));

    await expect(resolveOPNEXReferencePaths({ cwd: root })).resolves.toEqual({
      docsPath: path.join(root, "docs"),
      sourcePath: root,
    });
  });
});
