import { describe, expect, it } from "vitest";
import { buildRunOoxml, buildParagraphOoxml } from "../../src/office/ooxml";

describe("Word OOXML precision helpers", () => {
  it("writes eastAsia and ASCII fonts and escapes text", () => {
    const xml = buildRunOoxml({ text: "A&B", asciiFont: "Arial", eastAsiaFont: "黑体", sizeHalfPoints: 20, color: "640000", bold: true });
    expect(xml).toContain('w:ascii="Arial"'); expect(xml).toContain('w:eastAsia="黑体"'); expect(xml).toContain('<w:sz w:val="20"/>'); expect(xml).toContain("A&amp;B"); expect(xml).toContain("<w:b/>");
  });
  it("writes exact line spacing, indents, outline, and keep flags", () => {
    const xml = buildParagraphOoxml({ lineTwip: 360, lineRule: "exact", leftTwip: 1000, beforeTwip: 200, afterTwip: 50, outlineLevel: 1, keepNext: true, keepLines: true });
    expect(xml).toContain('w:line="360" w:lineRule="exact"'); expect(xml).toContain('w:left="1000"'); expect(xml).toContain('w:outlineLvl w:val="1"'); expect(xml).toContain("<w:keepNext/>"); expect(xml).toContain("<w:keepLines/>");
  });
});
