import { wrapInOoxmlPackage } from "../office/ooxml";
export type TocKind = "toc" | "figures";
export interface TocPlan { kind: TocKind; ooxml: string; headingStyle: string; entryStyles: string[]; }
const field = (instruction: string) => `<w:fldSimple w:instr="${instruction.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"><w:r><w:t>1</w:t></w:r></w:fldSimple>`;
export function planToc(kind: TocKind): TocPlan {
  if (kind === "figures") return { kind, headingStyle: "TOC Heading", entryStyles: ["table of figures"], ooxml: wrapInOoxmlPackage(`<w:p><w:pPr><w:pStyle w:val="TOC"/></w:pPr>${field(' TOC \\h \\z \\c "Figure" ')}</w:p>`) };
  return { kind, headingStyle: "TOC Heading", entryStyles: ["toc 1", "toc 2"], ooxml: wrapInOoxmlPackage(`<w:p><w:pPr><w:pStyle w:val="TOC"/></w:pPr>${field(' TOC \\o "1-3" \\h \\z \\u ')}</w:p>`) };
}
