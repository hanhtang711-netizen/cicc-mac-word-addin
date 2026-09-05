import { describe, expect, it } from "vitest";
import { planContainer } from "../../src/layout/layoutPlanner";
describe("CICC container geometry", () => {
  it("plans the three approved shapes", () => {
    expect(planContainer("wide")).toMatchObject({ columns: 1, rows: 3, columnWidthsTwip: [9570], imageRowHeightTwip: 3015, tableIndentTwip: 0 });
    expect(planContainer("narrow")).toMatchObject({ columns: 1, rows: 3, columnWidthsTwip: [6720], imageRowHeightTwip: 3600, tableIndentTwip: 2100 });
    expect(planContainer("double")).toMatchObject({ columns: 2, rows: 3, columnWidthsTwip: [4873, 4873], imageRowHeightTwip: 1707 });
  });
});
