import { describe, expect, it, test } from "vitest";
import {
  applyOPNEXManifestInstallCommonFields,
  getFrontmatterString,
  normalizeStringList,
  parseFrontmatterBool,
  parseOPNEXManifestInstallBase,
  resolveOPNEXManifestBlock,
  resolveOPNEXManifestInstall,
  resolveOPNEXManifestOs,
  resolveOPNEXManifestRequires,
} from "./frontmatter.js";

describe("shared/frontmatter", () => {
  test("normalizeStringList handles strings, arrays, and non-list values", () => {
    expect(normalizeStringList("a, b,,c")).toEqual(["a", "b", "c"]);
    expect(normalizeStringList([" a ", "", "b", 42])).toEqual(["a", "b", "42"]);
    expect(normalizeStringList(null)).toEqual([]);
  });

  test("getFrontmatterString extracts strings only", () => {
    expect(getFrontmatterString({ a: "b" }, "a")).toBe("b");
    expect(getFrontmatterString({ a: 1 }, "a")).toBeUndefined();
  });

  test("parseFrontmatterBool respects explicit values and fallback", () => {
    expect(parseFrontmatterBool("true", false)).toBe(true);
    expect(parseFrontmatterBool("false", true)).toBe(false);
    expect(parseFrontmatterBool(undefined, true)).toBe(true);
    expect(parseFrontmatterBool("maybe", false)).toBe(false);
  });

  test("resolveOPNEXManifestBlock reads current manifest keys and custom metadata fields", () => {
    expect(
      resolveOPNEXManifestBlock({
        frontmatter: {
          metadata: "{ opnex: { foo: 1, bar: 'baz' } }",
        },
      }),
    ).toEqual({ foo: 1, bar: "baz" });

    expect(
      resolveOPNEXManifestBlock({
        frontmatter: {
          pluginMeta: "{ opnex: { foo: 2 } }",
        },
        key: "pluginMeta",
      }),
    ).toEqual({ foo: 2 });
  });

  test("resolveOPNEXManifestBlock reads legacy manifest keys", () => {
    expect(
      resolveOPNEXManifestBlock({
        frontmatter: {
          metadata: "{ clawdbot: { requires: { bins: ['op'] }, install: [] } }",
        },
      }),
    ).toEqual({ requires: { bins: ["op"] }, install: [] });
  });

  test("resolveOPNEXManifestBlock prefers current manifest keys over legacy keys", () => {
    expect(
      resolveOPNEXManifestBlock({
        frontmatter: {
          metadata:
            "{ opnex: { requires: { bins: ['current'] } }, clawdbot: { requires: { bins: ['legacy'] } } }",
        },
      }),
    ).toEqual({ requires: { bins: ["current"] } });
  });

  test("resolveOPNEXManifestBlock returns undefined for invalid input", () => {
    expect(resolveOPNEXManifestBlock({ frontmatter: {} })).toBeUndefined();
    expect(
      resolveOPNEXManifestBlock({ frontmatter: { metadata: "not-json5" } }),
    ).toBeUndefined();
    expect(resolveOPNEXManifestBlock({ frontmatter: { metadata: "123" } })).toBeUndefined();
    expect(resolveOPNEXManifestBlock({ frontmatter: { metadata: "[]" } })).toBeUndefined();
    expect(
      resolveOPNEXManifestBlock({ frontmatter: { metadata: "{ nope: { a: 1 } }" } }),
    ).toBeUndefined();
  });

  it("normalizes manifest requirement and os lists", () => {
    expect(
      resolveOPNEXManifestRequires({
        requires: {
          bins: "bun, node",
          anyBins: [" ffmpeg ", ""],
          env: ["OPNEX_TOKEN", " OPNEX_URL "],
          config: null,
        },
      }),
    ).toEqual({
      bins: ["bun", "node"],
      anyBins: ["ffmpeg"],
      env: ["OPNEX_TOKEN", "OPNEX_URL"],
      config: [],
    });
    expect(resolveOPNEXManifestRequires({})).toBeUndefined();
    expect(resolveOPNEXManifestOs({ os: [" darwin ", "linux", ""] })).toEqual([
      "darwin",
      "linux",
    ]);
  });

  it("parses and applies install common fields", () => {
    const parsed = parseOPNEXManifestInstallBase(
      {
        type: " Brew ",
        id: "brew.git",
        label: "Git",
        bins: [" git ", "git"],
      },
      ["brew", "npm"],
    );

    expect(parsed).toEqual({
      raw: {
        type: " Brew ",
        id: "brew.git",
        label: "Git",
        bins: [" git ", "git"],
      },
      kind: "brew",
      id: "brew.git",
      label: "Git",
      bins: ["git", "git"],
    });
    expect(parseOPNEXManifestInstallBase({ kind: "bad" }, ["brew"])).toBeUndefined();
    expect(
      applyOPNEXManifestInstallCommonFields<{
        extra: boolean;
        id?: string;
        label?: string;
        bins?: string[];
      }>({ extra: true }, parsed!),
    ).toEqual({
      extra: true,
      id: "brew.git",
      label: "Git",
      bins: ["git", "git"],
    });
  });

  it("prefers explicit kind, ignores invalid common fields, and leaves missing ones untouched", () => {
    const parsed = parseOPNEXManifestInstallBase(
      {
        kind: " npm ",
        type: "brew",
        id: 42,
        label: null,
        bins: [" ", ""],
      },
      ["brew", "npm"],
    );

    expect(parsed).toEqual({
      raw: {
        kind: " npm ",
        type: "brew",
        id: 42,
        label: null,
        bins: [" ", ""],
      },
      kind: "npm",
    });
    expect(
      applyOPNEXManifestInstallCommonFields(
        { id: "keep", label: "Keep", bins: ["bun"] },
        parsed!,
      ),
    ).toEqual({
      id: "keep",
      label: "Keep",
      bins: ["bun"],
    });
  });

  it("maps install entries through the parser and filters rejected specs", () => {
    expect(
      resolveOPNEXManifestInstall(
        {
          install: [{ id: "keep" }, { id: "drop" }, "bad"],
        },
        (entry) => {
          if (
            typeof entry === "object" &&
            entry !== null &&
            (entry as { id?: string }).id === "keep"
          ) {
            return { id: "keep" };
          }
          return undefined;
        },
      ),
    ).toEqual([{ id: "keep" }]);
  });
});
