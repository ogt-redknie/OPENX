import { normalizeTranscriptForMatch } from "opnex/plugin-sdk/provider-test-contracts";
import { describe, expect, it } from "vitest";

describe("normalizeTranscriptForMatch", () => {
  it("normalizes punctuation and common OPNEX live transcription variants", () => {
    expect(normalizeTranscriptForMatch("Open-Claw integration OK")).toBe("opnexintegrationok");
    expect(normalizeTranscriptForMatch("Testing OpenFlaw realtime transcription")).toMatch(
      /open(?:claw|flaw)/,
    );
  });
});
