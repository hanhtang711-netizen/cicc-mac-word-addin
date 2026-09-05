import type { ContainerPlan } from "./layoutPlanner";
import { buildRunOoxml, wrapInOoxmlPackage } from "../office/ooxml";
import { createPictureSlots, type PictureSlot } from "./pictureSlots";

const figureNumberField = () => {
  const resultRun = buildRunOoxml({ text: "1", asciiFont: "黑体", eastAsiaFont: "黑体", complexScriptFont: "黑体", sizeHalfPoints: 19, eastAsiaSizeHalfPoints: 20, bold: true }).replace("</w:rPr>", "<w:noProof/></w:rPr>");
  return `<w:fldSimple w:instr=" SEQ Figure  \\* MERGEFORMAT ">${resultRun}</w:fldSimple>`;
};
const titleParagraph = () => `<w:p><w:pPr><w:pStyle w:val="ChartTableTitle"/><w:keepNext/><w:keepLines/><w:spacing w:before="100" w:after="1" w:line="300" w:lineRule="exact"/></w:pPr>${buildRunOoxml({ text: "图表", asciiFont: "Arial", eastAsiaFont: "黑体", sizeHalfPoints: 19, eastAsiaSizeHalfPoints: 20, bold: true })}${figureNumberField()}${buildRunOoxml({ text: "：", asciiFont: "Arial", eastAsiaFont: "黑体", sizeHalfPoints: 19, eastAsiaSizeHalfPoints: 20, bold: true })}</w:p>`;
const imageParagraph = (imageHeight: number, alignment: "left" | "center") => `<w:p><w:pPr><w:jc w:val="${alignment}"/><w:spacing w:line="${imageHeight}" w:lineRule="exact"/></w:pPr><w:r><w:t/></w:r></w:p>`;
const sourceParagraph = () => `<w:p><w:pPr><w:pStyle w:val="RPBodySourceLine"/><w:spacing w:before="1" w:after="100" w:line="200" w:lineRule="exact"/><w:jc w:val="left"/></w:pPr>${buildRunOoxml({ text: "资料来源：", eastAsiaFont: "黑体", complexScriptFont: "黑体", sizeHalfPoints: 13, eastAsiaSizeHalfPoints: 15, italic: true })}</w:p>`;
const sdtId = (tag: string) => tag.split("").reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) % 2147483646, 7) + 1;
const imageControl = (slot: PictureSlot, imageHeight: number, imageAlignment: "left" | "center") => `<w:sdt><w:sdtPr><w:alias w:val="CICC 图表图片"/><w:tag w:val="${slot.tag}"/><w:id w:val="${sdtId(slot.tag)}"/><w:picture/></w:sdtPr><w:sdtContent>${imageParagraph(imageHeight, imageAlignment)}</w:sdtContent></w:sdt>`;
const cell = (width: number, row: number, imageHeight: number, imageAlignment: "left" | "center", slot: PictureSlot) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/></w:tcPr>${row === 0 ? titleParagraph() : row === 1 ? imageControl(slot, imageHeight, imageAlignment) : sourceParagraph()}</w:tc>`;
export function buildContainerOoxml(plan: ContainerPlan, pictureSlots = createPictureSlots(plan, "preview")): string {
  const borders = `<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>`;
  const tableWidth = plan.columnWidthsTwip.reduce((sum, width) => sum + width, 0);
  const indentation = plan.tableIndentTwip > 0 ? `<w:tblInd w:w="${plan.tableIndentTwip}" w:type="dxa"/>` : "";
  const cellMargins = `<w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="${plan.horizontalCellMarginTwip}" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="${plan.horizontalCellMarginTwip}" w:type="dxa"/></w:tblCellMar>`;
  const grid = plan.columnWidthsTwip.map((w) => `<w:gridCol w:w="${w}"/>`).join("");
  const rows = Array.from({ length: 3 }, (_, row) => `<w:tr>${row === 1 ? `<w:trPr><w:trHeight w:val="${plan.imageRowHeightTwip}" w:hRule="atLeast"/></w:trPr>` : ""}${plan.columnWidthsTwip.map((w, column) => cell(w, row, plan.imageRowHeightTwip, plan.imageAlignment, pictureSlots[column])).join("")}</w:tr>`).join("");
  // Word for Mac expects the OOXML package envelope for insertOoxml().  A
  // bare w:tbl is accepted by some hosts but is rejected by the Mac host
  // before it reaches the document model ("content has problems", col 78).
  const table = `<w:tbl><w:tblPr><w:tblW w:w="${tableWidth}" w:type="dxa"/>${indentation}<w:tblLayout w:type="fixed"/>${cellMargins}${borders}</w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rows}</w:tbl>`;
  return wrapInOoxmlPackage(table);
}
