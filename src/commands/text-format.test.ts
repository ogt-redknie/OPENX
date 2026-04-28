import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("opnex", 16)).toBe("opnex");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("opnex-status-output", 10)).toBe("opnex-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
