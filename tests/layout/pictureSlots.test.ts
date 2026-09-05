import { describe, expect, it } from "vitest";
import { createPictureSlots, parsePictureSlotTag } from "../../src/layout/pictureSlots";
import { planContainer } from "../../src/layout/layoutPlanner";

describe("picture slots", () => {
  it("assigns each picture cell a stable CICC tag and usable content width", () => {
    const wide = createPictureSlots(planContainer("wide"), "fixture");
    const double = createPictureSlots(planContainer("double"), "fixture");

    expect(wide).toEqual([{ tag: "cicc-picture:wide:fixture:1", column: 0, widthPt: 478.5, heightPt: 150.75 }]);
    expect(double).toEqual([
      { tag: "cicc-picture:double:fixture:1", column: 0, widthPt: 232.85, heightPt: 85.35 },
      { tag: "cicc-picture:double:fixture:2", column: 1, widthPt: 232.85, heightPt: 85.35 },
    ]);
  });

  it("recovers sizing information from an existing CICC image-control tag", () => {
    expect(parsePictureSlotTag("cicc-picture:narrow:mn1p0:1")).toEqual({ kind: "narrow", column: 0, widthPt: 336, heightPt: 180 });
    expect(parsePictureSlotTag("not-a-cicc-control")).toBeUndefined();
  });
});
