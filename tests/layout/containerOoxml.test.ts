import { describe, expect, it } from "vitest";
import { buildContainerOoxml } from "../../src/layout/containerOoxml";
import { planContainer } from "../../src/layout/layoutPlanner";
import { createPictureSlots } from "../../src/layout/pictureSlots";
describe("blank container OOXML", () => {
  it("is borderless, fixed, and includes styled title/source rows without image prompts", () => {
    const plan = planContainer("double");
    const xml = buildContainerOoxml(plan, createPictureSlots(plan, "fixture"));
    expect(xml).toContain('<w:tblLayout w:type="fixed"/>'); expect(xml).toContain('<w:top w:val="nil"/>'); expect(xml).toContain('w:w="4873"'); expect(xml).toContain('w:val="1707"');
    expect(xml.match(/w:pStyle w:val="ChartTableTitle"/g)).toHaveLength(2);
    expect(xml.match(/w:pStyle w:val="RPBodySourceLine"/g)).toHaveLength(2);
    expect(xml.match(/<w:t[^>]*>图表<\/w:t>/g)).toHaveLength(2);
    expect(xml.match(/<w:fldSimple[^>]*SEQ Figure[^>]*>/g)).toHaveLength(2);
    const firstFigureField = xml.slice(xml.indexOf("<w:fldSimple"), xml.indexOf("</w:fldSimple>"));
    expect(firstFigureField).toContain('w:ascii="黑体"');
    expect(firstFigureField).toContain('w:eastAsia="黑体"');
    expect(firstFigureField).toContain("<w:b/>");
    expect(firstFigureField).toContain('w:sz w:val="19"');
    expect(firstFigureField).toContain('w:szCs w:val="20"');
    expect(xml.match(/<w:t[^>]*>：<\/w:t>/g)).toHaveLength(2);
    expect(xml.match(/<w:t[^>]*>资料来源：<\/w:t>/g)).toHaveLength(2);
    expect(xml).not.toMatch(/粘贴|在此|<w:drawing|<w:blip/);
    expect(xml).toContain('<w:picture/>');
    expect(xml).toContain('w:tag w:val="cicc-picture:double:fixture:1"');
    expect(xml).toContain('w:tag w:val="cicc-picture:double:fixture:2"');
  });

  it("matches the original wide and narrow placeholder footprints", () => {
    const wide = buildContainerOoxml(planContainer("wide"));
    const narrow = buildContainerOoxml(planContainer("narrow"));

    expect(wide).toContain('<w:tblW w:w="9570" w:type="dxa"/>');
    expect(wide).toContain('<w:trHeight w:val="3015" w:hRule="atLeast"/>');
    expect(wide).not.toContain("<w:tblInd");
    expect(narrow).toContain('<w:tblW w:w="6720" w:type="dxa"/>');
    expect(narrow).toContain('<w:tblInd w:w="2100" w:type="dxa"/>');
    expect(narrow).toContain('<w:trHeight w:val="3600" w:hRule="atLeast"/>');
  });
});
