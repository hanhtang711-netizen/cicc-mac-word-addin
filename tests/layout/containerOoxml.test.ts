import { describe, expect, it } from "vitest";
import { buildContainerOoxml } from "../../src/layout/containerOoxml";
import { planContainer } from "../../src/layout/layoutPlanner";
describe("blank container OOXML", () => {
  it("is borderless, fixed, and includes styled title/source rows without image prompts", () => {
    const xml = buildContainerOoxml(planContainer("double"));
    expect(xml).toContain('<w:tblLayout w:type="fixed"/>'); expect(xml).toContain('<w:top w:val="nil"/>'); expect(xml).toContain('w:w="4873"'); expect(xml).toContain('w:val="1707"');
    expect(xml.match(/w:pStyle w:val="ChartTableTitle"/g)).toHaveLength(2);
    expect(xml.match(/w:pStyle w:val="RPBodySourceLine"/g)).toHaveLength(2);
    expect(xml.match(/<w:t[^>]*>图表<\/w:t>/g)).toHaveLength(2);
    expect(xml.match(/<w:fldSimple[^>]*SEQ Figure[^>]*>/g)).toHaveLength(2);
    const firstFigureField = xml.slice(xml.indexOf("<w:fldSimple"), xml.indexOf("</w:fldSimple>"));
    expect(firstFigureField).toContain('w:eastAsia="黑体"');
    expect(firstFigureField).toContain("<w:b/>");
    expect(firstFigureField).toContain('w:sz w:val="19"');
    expect(firstFigureField).toContain('w:szCs w:val="20"');
    expect(xml.match(/<w:t[^>]*>：<\/w:t>/g)).toHaveLength(2);
    expect(xml.match(/<w:t[^>]*>资料来源：<\/w:t>/g)).toHaveLength(2);
    expect(xml).not.toMatch(/粘贴|在此|<w:drawing|<w:blip/);
  });
});
