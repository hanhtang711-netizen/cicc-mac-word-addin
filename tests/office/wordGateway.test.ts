import { describe, expect, it } from "vitest";
import { WordGateway } from "../../src/office/wordGateway";

describe("Word gateway", () => {
  it("applies selection formatting without touching the whole document", async () => {
    const calls: string[] = [];
    const range: any = { font: {}, paragraphFormat: {}, style: "Normal", insertOoxml: (xml: string) => { calls.push(xml); } };
    const gateway = new WordGateway(async (callback) => callback({ document: { getSelection: () => range }, sync: async () => undefined } as any));
    await gateway.applySelectionStyle("bodyHeading1");
    expect(range.style).toBe("Heading 1"); expect(range.font.size).toBe(16); expect(calls.join("\n")).toContain("outlineLvl");
  });
});
