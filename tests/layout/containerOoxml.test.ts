import { describe, expect, it } from "vitest";
import { buildContainerOoxml } from "../../src/layout/containerOoxml";
import { planContainer } from "../../src/layout/layoutPlanner";
describe("blank container OOXML", () => {
  it("is borderless, fixed, and contains no placeholder text or images", () => {
    const xml = buildContainerOoxml(planContainer("double"));
    expect(xml).toContain('<w:tblLayout w:type="fixed"/>'); expect(xml).toContain('<w:top w:val="nil"/>'); expect(xml).toContain('w:w="4873"'); expect(xml).toContain('w:val="1707"'); expect(xml).not.toMatch(/粘贴|图表|图片|<w:drawing|<w:blip/);
  });
});
