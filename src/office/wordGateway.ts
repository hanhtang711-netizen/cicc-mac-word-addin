import { planSelectionStyle } from "../styles/stylePlanner";
import type { CICCStyleId } from "../styles/ciccTokens";
import { planContainer } from "../layout/layoutPlanner";
import { buildContainerOoxml } from "../layout/containerOoxml";
import { TocService } from "../toc/tocService";

export type WordRun = (callback: (context: any) => Promise<void>) => Promise<void>;

export class WordGateway {
  constructor(private readonly run: WordRun = (callback) => Word.run(callback)) {}

  async applySelectionStyle(styleId: CICCStyleId): Promise<void> {
    const plan = planSelectionStyle(styleId);
    await this.run(async (context) => {
      const range: any = context.document.getSelection();
      range.load?.("text");
      await context.sync();
      if (range.text === undefined && range.load) throw new Error("无法读取当前选区");
      const font = range.font ?? (range.font = {}); const para = range.paragraphFormat ?? (range.paragraphFormat = {});
      if (plan.run.asciiFont) { font.name = plan.run.asciiFont; font.nameAscii = plan.run.asciiFont; font.nameFarEast = plan.run.eastAsiaFont; }
      if (plan.run.eastAsiaFont) font.nameFarEast = plan.run.eastAsiaFont;
      if (plan.run.sizePt !== undefined) font.size = plan.run.sizePt;
      if (plan.run.color) font.color = plan.run.color;
      if (plan.run.bold !== undefined) font.bold = plan.run.bold;
      if (plan.run.italic !== undefined) font.italic = plan.run.italic;
      if (plan.run.underline !== undefined) font.underline = plan.run.underline ? "Single" : "None";
      const p = plan.paragraph;
      if (p.leftIndentTwip !== undefined) para.leftIndent = p.leftIndentTwip / 20;
      if (p.firstLineIndentTwip !== undefined) para.firstLineIndent = p.firstLineIndentTwip / 20;
      if (p.spaceBeforeTwip !== undefined) para.spaceBefore = p.spaceBeforeTwip / 20;
      if (p.spaceAfterTwip !== undefined) para.spaceAfter = p.spaceAfterTwip / 20;
      if (p.lineSpacingPt !== undefined) { para.lineSpacing = p.lineSpacingPt; para.lineSpacingRule = "Exactly"; }
      if (p.keepWithNext !== undefined) para.keepWithNext = p.keepWithNext;
      if (p.keepTogether !== undefined) para.keepTogether = p.keepTogether;
      if (plan.listLevel !== undefined && range.listFormat) { range.listFormat.applyBullet?.(); range.listFormat.level = plan.listLevel; }
      if (plan.outlineLevel !== undefined) para.outlineLevel = plan.outlineLevel;
      await context.sync();

      // Word for Mac can reject style assignment in compatibility-mode or
      // documents that do not contain the built-in style (InvalidArgument).
      // The direct formatting above is the authoritative CICC appearance and
      // must not be rolled back just because an optional style name is absent.
      // Try the semantic style only after the formatting batch has committed.
      if (plan.wordStyle) {
        try {
          range.style = plan.wordStyle;
          await context.sync();
        } catch {
          // Keep the direct formatting and outline level as the portable
          // fallback; no user-visible failure is warranted for this optional
          // metadata step.
        }
      }
    });
  }

  async insertLayout(kind: "wide"|"narrow"|"double"): Promise<void> {
    const plan = planContainer(kind);
    await this.run(async (context) => { const range: any = context.document.getSelection(); range.insertOoxml(buildContainerOoxml(plan), "Before"); await context.sync(); });
  }

  async insertOrUpdateToc(kind: "toc"|"figures"): Promise<void> {
    await new TocService(this.run).insertOrUpdate(kind);
  }
}
