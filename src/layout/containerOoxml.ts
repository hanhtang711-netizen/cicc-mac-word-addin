import type { ContainerPlan } from "./layoutPlanner";
import { buildRunOoxml, wrapInOoxmlPackage } from "../office/ooxml";

const figureNumberField = () => {
  const resultRun = buildRunOoxml({ text: "1", asciiFont: "黑体", eastAsiaFont: "黑体", complexScriptFont: "黑体", sizeHalfPoints: 19, eastAsiaSizeHalfPoints: 20, bold: true }).replace("</w:rPr>", "<w:noProof/></w:rPr>");
  return `<w:fldSimple w:instr=" SEQ Figure  \\* MERGEFORMAT ">${resultRun}</w:fldSimple>`;
};
const titleParagraph = () => `<w:p><w:pPr><w:pStyle w:val="ChartTableTitle"/><w:keepNext/><w:keepLines/><w:spacing w:before="100" w:after="1" w:line="300" w:lineRule="exact"/></w:pPr>${buildRunOoxml({ text: "图表", asciiFont: "Arial", eastAsiaFont: "黑体", sizeHalfPoints: 19, eastAsiaSizeHalfPoints: 20, bold: true })}${figureNumberField()}${buildRunOoxml({ text: "：", asciiFont: "Arial", eastAsiaFont: "黑体", sizeHalfPoints: 19, eastAsiaSizeHalfPoints: 20, bold: true })}</w:p>`;
const imageParagraph = (imageHeight: number) => `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="${imageHeight}" w:lineRule="exact"/></w:pPr></w:p>`;
const sourceParagraph = () => `<w:p><w:pPr><w:pStyle w:val="RPBodySourceLine"/><w:spacing w:before="1" w:after="100" w:line="200" w:lineRule="exact"/><w:jc w:val="left"/></w:pPr>${buildRunOoxml({ text: "资料来源：", eastAsiaFont: "黑体", complexScriptFont: "黑体", sizeHalfPoints: 13, eastAsiaSizeHalfPoints: 15, italic: true })}</w:p>`;
const cell = (width: number, row: number, imageHeight: number) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/></w:tcPr>${row === 0 ? titleParagraph() : row === 1 ? imageParagraph(imageHeight) : sourceParagraph()}</w:tc>`;
export function buildContainerOoxml(plan: ContainerPlan): string {
  const borders = `<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>`;
  const grid = plan.columnWidthsTwip.map((w) => `<w:gridCol w:w="${w}"/>`).join("");
  const rows = Array.from({ length: 3 }, (_, row) => `<w:tr>${row === 1 ? `<w:trPr><w:trHeight w:val="${plan.imageRowHeightTwip}" w:hRule="atLeast"/></w:trPr>` : ""}${plan.columnWidthsTwip.map((w) => cell(w, row, plan.imageRowHeightTwip)).join("")}</w:tr>`).join("");
  // Word for Mac expects the OOXML package envelope for insertOoxml().  A
  // bare w:tbl is accepted by some hosts but is rejected by the Mac host
  // before it reaches the document model ("content has problems", col 78).
  const table = `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblLayout w:type="fixed"/>${borders}</w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rows}</w:tbl>`;
  return wrapInOoxmlPackage(table);
}
