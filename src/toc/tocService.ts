import { planToc, type TocKind } from "./tocPlanner";
import type { WordRun } from "../office/wordGateway";
export class TocService {
  constructor(private readonly run: WordRun = (callback) => Word.run(callback)) {}
  async insertOrUpdate(kind: TocKind): Promise<void> {
    const plan = planToc(kind);
    await this.run(async (context) => {
      const range: any = context.document.getSelection();
      if (range.fields?.load) { range.fields.load("items"); await context.sync(); }
      if (range.fields?.items?.length) { for (const f of range.fields.items) f.update?.(); await context.sync(); return; }
      range.insertOoxml(plan.ooxml, "Before"); await context.sync();
    });
  }
}
