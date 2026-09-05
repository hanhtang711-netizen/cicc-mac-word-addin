import { describe, expect, it } from "vitest";
import { TocService } from "../../src/toc/tocService";
describe("TOC service", () => {
  it("inserts the planned native field at the current insertion point", async () => {
    let xml = ""; const service = new TocService(async (cb) => cb({ document: { getSelection: () => ({ insertOoxml: (value: string) => { xml = value; } }) }, sync: async () => undefined } as any));
    await service.insertOrUpdate("toc"); expect(xml).toContain("TOC");
  });
});
