import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Word add-in manifest foundation", () => {
  it("declares the Word host and CICC command surfaces", () => {
    const xml = readFileSync(resolve(import.meta.dirname, "../../manifest/manifest.template.xml"), "utf8");
    expect(xml).toContain('<Host Name="Document" />');
    expect(xml).toContain("CiccWord.Tab");
    expect(xml).toContain("正文样式");
    expect(xml).toContain("图表版式");
    expect(xml).toContain("目录");
    expect(xml).toContain("taskpane.html");
  });
});
