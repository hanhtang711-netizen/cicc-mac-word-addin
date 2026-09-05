export type LayoutKind = "wide" | "narrow" | "double";
export interface ContainerPlan { kind: LayoutKind; columns: number; rows: 3; columnWidthsTwip: number[]; imageRowHeightTwip: number; }
export function planContainer(kind: LayoutKind): ContainerPlan {
  if (kind === "double") return { kind, columns: 2, rows: 3, columnWidthsTwip: [4873, 4873], imageRowHeightTwip: 1707 };
  if (kind === "wide") return { kind, columns: 1, rows: 3, columnWidthsTwip: [9746], imageRowHeightTwip: 3067 };
  return { kind, columns: 1, rows: 3, columnWidthsTwip: [9746], imageRowHeightTwip: 5220 };
}
