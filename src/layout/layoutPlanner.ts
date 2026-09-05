export type LayoutKind = "wide" | "narrow" | "double";
export interface ContainerPlan {
  kind: LayoutKind;
  columns: number;
  rows: 3;
  columnWidthsTwip: number[];
  imageRowHeightTwip: number;
  tableIndentTwip: number;
  imageAlignment: "left" | "center";
  horizontalCellMarginTwip: number;
}

export function planContainer(kind: LayoutKind): ContainerPlan {
  if (kind === "double") return { kind, columns: 2, rows: 3, columnWidthsTwip: [4873, 4873], imageRowHeightTwip: 1707, tableIndentTwip: 0, imageAlignment: "center", horizontalCellMarginTwip: 108 };
  // The original CICC plug-in inserts its 638 × 201 px wide-chart image at
  // 96 dpi, which yields a 9,570 × 3,015 twip footprint.
  if (kind === "wide") return { kind, columns: 1, rows: 3, columnWidthsTwip: [9570], imageRowHeightTwip: 3015, tableIndentTwip: 0, imageAlignment: "left", horizontalCellMarginTwip: 0 };
  // Its narrow-chart image is 448 × 240 px at 96 dpi.  It is left-indented
  // by 10 Chinese character units (2,100 twips), rather than stretched to
  // the full text width.
  return { kind, columns: 1, rows: 3, columnWidthsTwip: [6720], imageRowHeightTwip: 3600, tableIndentTwip: 2100, imageAlignment: "left", horizontalCellMarginTwip: 0 };
}
