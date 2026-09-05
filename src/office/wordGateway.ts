import { planSelectionStyle } from "../styles/stylePlanner";
import type { CICCStyleId } from "../styles/ciccTokens";
import { planContainer } from "../layout/layoutPlanner";
import { buildContainerOoxml } from "../layout/containerOoxml";
import { createPictureSlots, parsePictureSlotTag, type PictureSlot } from "../layout/pictureSlots";
import { TocService } from "../toc/tocService";

export type WordRun = (callback: (context: any) => Promise<void>) => Promise<void>;

export class WordGateway {
  private readonly boundPictureControlIds = new Set<number>();
  private nextPictureContainer = 0;

  constructor(private readonly run: WordRun = (callback) => Word.run(callback)) {}

  private supportsPictureChangeEvents(): boolean {
    return (globalThis as any).Office?.context?.requirements?.isSetSupported?.("WordApi", "1.5") === true;
  }

  private async resizePictures(controlId: number, slot: Pick<PictureSlot, "widthPt" | "heightPt">): Promise<void> {
    await this.run(async (context) => {
      const control: any = context.document.contentControls.getById(controlId);
      const pictures: any = control.inlinePictures;
      pictures.load?.("items");
      await context.sync();
      for (const picture of pictures.items ?? []) {
        // This order mirrors the original CICC command: first establish the
        // configured height, then set the column width while keeping the
        // source image's aspect ratio.  Arbitrary pasted images therefore fit
        // their column without distortion, and the at-least table row expands
        // instead of allowing an image to overlap the source line.
        picture.lockAspectRatio = true;
        picture.height = slot.heightPt;
        picture.width = slot.widthPt;
      }
      await context.sync();
    });
  }

  private async bindPictureSlots(context: any, slots: PictureSlot[]): Promise<void> {
    if (!this.supportsPictureChangeEvents()) return;
    const matches = slots.map((slot) => ({ slot, controls: context.document.contentControls.getByTag(slot.tag) }));
    for (const match of matches) match.controls.load?.("items/id");
    await context.sync();

    const newlyBound: number[] = [];
    for (const { slot, controls } of matches) {
      for (const control of controls.items ?? []) {
        if (this.boundPictureControlIds.has(control.id) || !control.onDataChanged?.add) continue;
        control.onDataChanged.add(async (event: { ids?: number[] }) => {
          for (const id of event.ids ?? []) {
            try { await this.resizePictures(id, slot); } catch { /* Keep normal Word pasting available if the host rejects an optional resize. */ }
          }
        });
        newlyBound.push(control.id);
      }
    }
    await context.sync();
    for (const id of newlyBound) this.boundPictureControlIds.add(id);
  }

  /** Reconnect image auto-fit after the task pane is reopened for a document. */
  async enablePictureAutoFit(): Promise<void> {
    if (!this.supportsPictureChangeEvents()) return;
    await this.run(async (context) => {
      const controls: any = context.document.contentControls;
      controls.load?.("items/tag,id");
      await context.sync();
      const slots: PictureSlot[] = [];
      for (const control of controls.items ?? []) {
        const parsed = parsePictureSlotTag(control.tag);
        if (parsed) slots.push({ ...parsed, tag: control.tag });
      }
      await this.bindPictureSlots(context, slots);
    });
  }

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
    const pictureSlots = createPictureSlots(plan, `${Date.now().toString(36)}${(++this.nextPictureContainer).toString(36)}`);
    await this.run(async (context) => {
      const range: any = context.document.getSelection();
      const inserted: any = range.insertOoxml(buildContainerOoxml(plan, pictureSlots), "Before");
      await context.sync();
      await this.bindPictureSlots(context, pictureSlots);
      // Refresh SEQ Figure fields so the newly inserted caption displays its
      // current number immediately.  Field updates are optional metadata;
      // hosts that do not expose fields must still keep the layout insertion.
      try {
        if (inserted?.fields?.load) {
          inserted.fields.load("items");
          await context.sync();
          for (const field of inserted.fields.items ?? []) field.update?.();
          await context.sync();
        }
      } catch {
        // The OOXML field remains in the document and can be refreshed with
        // Word's normal Update Field command when the host declines updates.
      }
    });
  }

  async insertOrUpdateToc(kind: "toc"|"figures"): Promise<void> {
    await new TocService(this.run).insertOrUpdate(kind);
  }
}
