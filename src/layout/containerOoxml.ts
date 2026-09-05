import type { ContainerPlan } from "./layoutPlanner";
import { wrapInOoxmlPackage } from "../office/ooxml";
const cell = (width: number, row: number, imageHeight: number) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/>${row === 1 ? `<w:spacing w:line="${imageHeight}" w:lineRule="exact"/>` : ""}</w:pPr></w:p></w:tc>`;
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
