import { describe, expect, it } from "vitest";
import { CICC_TOKENS } from "../../src/styles/ciccTokens";

describe("Coal India CICC tokens", () => {
  it("keeps exact body heading measurements", () => {
    expect(CICC_TOKENS.bodyHeading1).toMatchObject({ color: "640000", sizePt: 16, leftIndentTwip: 1000, lineSpacingPt: 18, spaceAfterTwip: 150, outlineLevel: 0 });
    expect(CICC_TOKENS.bodyHeading2).toMatchObject({ bold: true, eastAsiaFont: "黑体", sizePt: 12, leftIndentTwip: 1000, lineSpacingPt: 18, spaceBeforeTwip: 200, spaceAfterTwip: 50, outlineLevel: 1 });
    expect(CICC_TOKENS.bodyHeading3).toMatchObject({ color: "595757", underline: true, sizePt: 12, leftIndentTwip: 1000, firstLineIndentTwip: 1, lineSpacingPt: 18, outlineLevel: 2 });
  });

  it("keeps body, chart title, and source line typography", () => {
    expect(CICC_TOKENS.body).toMatchObject({ asciiFont: "Arial", eastAsiaFont: "黑体", sizePt: 9.5, eastAsiaSizePt: 10, lineSpacingPt: 14.5, spaceAfterTwip: 50 });
    expect(CICC_TOKENS.chartTitle).toMatchObject({ bold: true, lineSpacingPt: 15, spaceBeforeTwip: 100, spaceAfterTwip: 1, keepWithNext: true, keepTogether: true });
    expect(CICC_TOKENS.sourceLine).toMatchObject({ italic: true, eastAsiaFont: "黑体", sizePt: 6.5, eastAsiaSizePt: 7.5, lineSpacingPt: 10, spaceBeforeTwip: 1, spaceAfterTwip: 100 });
  });
});
