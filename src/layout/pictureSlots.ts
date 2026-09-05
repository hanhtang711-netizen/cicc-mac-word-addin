import { planContainer, type ContainerPlan, type LayoutKind } from "./layoutPlanner";

export interface PictureSlot {
  tag: string;
  column: number;
  widthPt: number;
  heightPt: number;
}

const tagFor = (kind: LayoutKind, containerId: string, column: number) => `cicc-picture:${kind}:${containerId}:${column + 1}`;

/**
 * Creates the invisible identity and the target footprint for every image
 * cell.  The width excludes the table-cell margins so the resized image stays
 * inside the caption/source column rather than bleeding into its neighbour.
 */
export function createPictureSlots(plan: ContainerPlan, containerId: string): PictureSlot[] {
  return plan.columnWidthsTwip.map((columnWidthTwip, column) => ({
    tag: tagFor(plan.kind, containerId, column),
    column,
    widthPt: (columnWidthTwip - plan.horizontalCellMarginTwip * 2) / 20,
    heightPt: plan.imageRowHeightTwip / 20,
  }));
}

/** Returns the layout encoded in a CICC image-control tag, if it is one. */
export function parsePictureSlotTag(tag: string): Pick<PictureSlot, "column" | "widthPt" | "heightPt"> & { kind: LayoutKind } | undefined {
  const match = /^cicc-picture:(wide|narrow|double):[a-z0-9]+:([1-9]\d*)$/.exec(tag);
  if (!match) return undefined;
  const kind = match[1] as LayoutKind;
  const column = Number(match[2]) - 1;
  const plan = planContainer(kind);
  if (column >= plan.columns) return undefined;
  return { kind, column, widthPt: (plan.columnWidthsTwip[column] - plan.horizontalCellMarginTwip * 2) / 20, heightPt: plan.imageRowHeightTwip / 20 };
}
