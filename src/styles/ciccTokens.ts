export type CICCStyleId =
  | "bodyHeading1" | "bodyHeading2" | "bodyHeading3" | "body" | "bodyIndented"
  | "bullet1" | "bullet2" | "chartTitle" | "sourceLine"
  | "tocHeading" | "toc1" | "toc2" | "tableOfFigures";

export interface CICCStyleToken {
  asciiFont?: string; eastAsiaFont?: string; complexScriptFont?: string;
  sizePt?: number; eastAsiaSizePt?: number; color?: string;
  bold?: boolean; italic?: boolean; underline?: boolean;
  leftIndentTwip?: number; firstLineIndentTwip?: number;
  spaceBeforeTwip?: number; spaceAfterTwip?: number;
  lineSpacingPt?: number; keepWithNext?: boolean; keepTogether?: boolean;
  outlineLevel?: number; listLevel?: number; bulletChar?: string;
  wordStyle?: string;
}

const body: CICCStyleToken = {
  asciiFont: "Arial", eastAsiaFont: "黑体", complexScriptFont: "黑体",
  sizePt: 9.5, eastAsiaSizePt: 10, lineSpacingPt: 14.5, spaceAfterTwip: 50,
};

export const CICC_TOKENS: Readonly<Record<CICCStyleId, CICCStyleToken>> = Object.freeze({
  bodyHeading1: { asciiFont: "Arial", eastAsiaFont: "黑体", sizePt: 16, color: "640000", leftIndentTwip: 1000, lineSpacingPt: 18, spaceAfterTwip: 150, outlineLevel: 0, wordStyle: "Heading 1" },
  bodyHeading2: { asciiFont: "Arial", eastAsiaFont: "黑体", sizePt: 12, bold: true, leftIndentTwip: 1000, lineSpacingPt: 18, spaceBeforeTwip: 200, spaceAfterTwip: 50, outlineLevel: 1, wordStyle: "Heading 2" },
  bodyHeading3: { asciiFont: "Arial", eastAsiaFont: "黑体", sizePt: 12, color: "595757", underline: true, leftIndentTwip: 1000, firstLineIndentTwip: 1, lineSpacingPt: 18, spaceBeforeTwip: 150, spaceAfterTwip: 50, outlineLevel: 2, wordStyle: "Heading 3" },
  body,
  bodyIndented: { ...body, leftIndentTwip: 1000 },
  bullet1: { ...body, listLevel: 0, bulletChar: "•" },
  bullet2: { ...body, listLevel: 1, bulletChar: "◦" },
  chartTitle: { asciiFont: "Arial", eastAsiaFont: "黑体", sizePt: 9.5, eastAsiaSizePt: 10, bold: true, lineSpacingPt: 15, spaceBeforeTwip: 100, spaceAfterTwip: 1, keepWithNext: true, keepTogether: true },
  sourceLine: { eastAsiaFont: "黑体", complexScriptFont: "黑体", sizePt: 6.5, eastAsiaSizePt: 7.5, italic: true, lineSpacingPt: 10, spaceBeforeTwip: 1, spaceAfterTwip: 100 },
  tocHeading: { asciiFont: "Arial", eastAsiaFont: "黑体", sizePt: 16, eastAsiaSizePt: 16, bold: true, color: "640000", lineSpacingPt: 18, spaceAfterTwip: 50 },
  toc1: { bold: true, lineSpacingPt: 18 },
  toc2: { lineSpacingPt: 14.5, leftIndentTwip: 420 },
  tableOfFigures: { lineSpacingPt: 14.5 },
});
