import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderManifest } from "../../scripts/render-manifest-lib.mjs";
const projectRoot = resolve(import.meta.dirname, "../..");

describe("manifest renderer", () => {
  it("replaces every base URL and rejects insecure hosts", () => {
    expect(renderManifest("{{BASE_URL}}/taskpane.html", "https://example.com")).toBe("https://example.com/taskpane.html");
    expect(() => renderManifest("{{BASE_URL}}", "http://example.com")).toThrow("HTTPS");
    expect(() => renderManifest("{{BASE_URL}}", "https://foo.localhost")).toThrow("HTTPS");
  });
  it("assigns semantic icons to Word ribbon controls", async () => {
    const template = await readFile(resolve(projectRoot, "manifest/manifest.template.xml"), "utf8");
    const iconResidFor = (controlId: string) =>
      template.match(
        new RegExp(`<Control xsi:type="(?:Menu|Button)" id="${controlId}">[\\s\\S]*?<Icon><bt:Image size="16" resid="([^"]+)"`),
      )?.[1];

    expect(iconResidFor("BodyStyles.Menu")).toBe("StyleIcon.16");
    expect(iconResidFor("Layouts.Menu")).toBe("LayoutIcon.16");
    expect(iconResidFor("InsertToc")).toBe("TocIcon.16");
    expect(iconResidFor("InsertFigures")).toBe("FiguresIcon.16");
    expect(iconResidFor("OpenTaskpane")).toBe("TaskpaneIcon.16");
    for (const iconId of ["StyleIcon", "LayoutIcon", "TocIcon", "FiguresIcon", "TaskpaneIcon", "WordIcon"]) {
      expect(template).toContain(`<bt:Image id="${iconId}.80"`);
    }
  });

});
