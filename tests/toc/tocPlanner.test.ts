import { describe, expect, it } from "vitest";
import { planToc } from "../../src/toc/tocPlanner";
describe("native CICC directory planner", () => {
  it("plans a Heading 1-3 native TOC", () => {
    const plan = planToc("toc"); expect(plan.ooxml).toContain("TOC"); expect(plan.ooxml).toContain("1-3"); expect(plan.headingStyle).toBe("TOC Heading"); expect(plan.entryStyles).toEqual(["toc 1", "toc 2"]);
  });
  it("plans a native figure directory", () => {
    const plan = planToc("figures"); expect(plan.ooxml).toContain("TOC"); expect(plan.ooxml).toContain("Figure"); expect(plan.headingStyle).toBe("TOC Heading");
  });
});
