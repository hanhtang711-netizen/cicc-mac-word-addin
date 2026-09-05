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

  it("updates figure sequence fields immediately after inserting a layout", async () => {
    let updated = 0;
    const inserted: any = {
      fields: {
        items: [{ update: () => { updated += 1; } }],
        load: () => undefined,
      },
    };
    const range: any = { insertOoxml: () => inserted };
    const gateway = new WordGateway(async (callback) => callback({
      document: { getSelection: () => range },
      sync: async () => undefined,
    } as any));

    await gateway.insertLayout("wide");
    expect(updated).toBe(1);
  });

  it("fits a pasted image to its CICC picture control after the control changes", async () => {
    const originalOffice = (globalThis as any).Office;
    (globalThis as any).Office = { context: { requirements: { isSetSupported: (set: string, version: string) => set === "WordApi" && version === "1.5" } } };
    try {
      let onDataChanged: ((args: { ids: number[] }) => Promise<void>) | undefined;
      const picture: any = {};
      const pictureControl: any = { id: 501, onDataChanged: { add: (handler: (args: { ids: number[] }) => Promise<void>) => { onDataChanged = handler; } } };
      const contentControls: any = {
        getByTag: () => ({ items: [pictureControl], load: () => undefined }),
        getById: () => ({ inlinePictures: { items: [picture], load: () => undefined } }),
      };
      const range: any = { insertOoxml: () => ({}) };
      const gateway = new WordGateway(async (callback) => callback({
        document: { getSelection: () => range, contentControls },
        sync: async () => undefined,
      } as any));

      await gateway.insertLayout("wide");
      await onDataChanged?.({ ids: [501] });

      expect(picture.lockAspectRatio).toBe(true);
      expect(picture.height).toBeUndefined();
      expect(picture.width).toBe(478.5);
    } finally {
      (globalThis as any).Office = originalOffice;
    }
  });
});
