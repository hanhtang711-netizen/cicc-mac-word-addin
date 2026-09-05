import { describe, expect, it } from "vitest";
import { planSelectionStyle } from "../../src/styles/stylePlanner";

describe("selection style planner", () => {
  it("maps CICC title buttons to native Word outline levels", () => {
    expect(planSelectionStyle("bodyHeading1")).toMatchObject({ wordStyle: "Heading 1", outlineLevel: 0 });
    expect(planSelectionStyle("bodyHeading2")).toMatchObject({ wordStyle: "Heading 2", outlineLevel: 1 });
    expect(planSelectionStyle("bodyHeading3")).toMatchObject({ wordStyle: "Heading 3", outlineLevel: 2 });
  });
  it("adds only the requested left indent to an indented body", () => {
    const plan = planSelectionStyle("bodyIndented");
    expect(plan.paragraph.leftIndentTwip).toBe(1000);
    expect(plan.paragraph.spaceAfterTwip).toBe(50);
  });
  it("uses distinct bullet levels", () => {
    expect(planSelectionStyle("bullet1").listLevel).toBe(0);
    expect(planSelectionStyle("bullet2").listLevel).toBe(1);
  });
});
