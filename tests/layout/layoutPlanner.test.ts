import { describe, expect, it } from "vitest";
import { planContainer } from "../../src/layout/layoutPlanner";
describe("CICC container geometry", () => {
  it("plans the three approved shapes", () => {
    expect(planContainer("wide")).toMatchObject({ columns: 1, rows: 3, imageRowHeightTwip: 3067 });
    expect(planContainer("narrow")).toMatchObject({ columns: 1, rows: 3, imageRowHeightTwip: 5220 });
    expect(planContainer("double")).toMatchObject({ columns: 2, rows: 3, columnWidthsTwip: [4873, 4873], imageRowHeightTwip: 1707 });
  });
});
