import { describe, expect, it } from "vitest";
import {
  parseArgs,
  validateOPNEXPackageSpec,
} from "../../scripts/resolve-opnex-package-candidate.mjs";

describe("resolve-opnex-package-candidate", () => {
  it("accepts only OPNEX release package specs for npm candidates", () => {
    expect(() => validateOPNEXPackageSpec("opnex@beta")).not.toThrow();
    expect(() => validateOPNEXPackageSpec("opnex@latest")).not.toThrow();
    expect(() => validateOPNEXPackageSpec("opnex@2026.4.27")).not.toThrow();
    expect(() => validateOPNEXPackageSpec("opnex@2026.4.27-1")).not.toThrow();
    expect(() => validateOPNEXPackageSpec("opnex@2026.4.27-beta.2")).not.toThrow();

    expect(() => validateOPNEXPackageSpec("@evil/opnex@1.0.0")).toThrow(
      "package_spec must be opnex@beta",
    );
    expect(() => validateOPNEXPackageSpec("opnex@canary")).toThrow(
      "package_spec must be opnex@beta",
    );
    expect(() => validateOPNEXPackageSpec("opnex@2026.04.27")).toThrow(
      "package_spec must be opnex@beta",
    );
  });

  it("parses optional empty workflow inputs without rejecting the command line", () => {
    expect(
      parseArgs([
        "--source",
        "npm",
        "--package-ref",
        "release/2026.4.27",
        "--package-spec",
        "opnex@beta",
        "--package-url",
        "",
        "--package-sha256",
        "",
        "--artifact-dir",
        ".",
        "--output-dir",
        ".artifacts/docker-e2e-package",
      ]),
    ).toMatchObject({
      artifactDir: ".",
      outputDir: ".artifacts/docker-e2e-package",
      packageSha256: "",
      packageRef: "release/2026.4.27",
      packageSpec: "opnex@beta",
      packageUrl: "",
      source: "npm",
    });
  });
});
