import { describe, expect, it } from "vitest";
import { WordGateway } from "../../src/office/wordGateway";

describe("Word gateway", () => {
  it("applies selection formatting without touching the whole document", async () => {
    const calls: string[] = [];
    const range: any = { font: {}, paragraphFormat: {}, style: "Normal", insertOoxml: (xml: string) => { calls.push(xml); } };
    const gateway = new WordGateway(async (callback) => callback({ document: { getSelection: () => range }, sync: async () => undefined } as any));
    await gateway.applySelectionStyle("bodyHeading1");
    expect(range.style).toBe("Heading 1"); expect(range.font.size).toBe(16); expect(range.paragraphFormat.outlineLevel).toBe(0); expect(calls).toEqual([]);
  });

  it("keeps direct formatting when optional semantic style assignment is rejected", async () => {
    let syncCount = 0;
    const range: any = { font: {}, paragraphFormat: {}, style: "Normal", insertOoxml: () => undefined };
    const gateway = new WordGateway(async (callback) => callback({
      document: { getSelection: () => range },
      sync: async () => {
        syncCount += 1;
        if (syncCount === 3) throw new Error("InvalidArgument");
      },
    } as any));

    await expect(gateway.applySelectionStyle("bodyHeading1")).resolves.toBeUndefined();
    expect(range.font.size).toBe(16);
    expect(range.font.color).toBe("640000");
    expect(range.paragraphFormat.outlineLevel).toBe(0);
    expect(range.style).toBe("Heading 1");
  });
});
