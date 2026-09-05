export interface RunPlan { text?: string; asciiFont?: string; eastAsiaFont?: string; complexScriptFont?: string; sizeHalfPoints?: number; eastAsiaSizeHalfPoints?: number; color?: string; bold?: boolean; italic?: boolean; underline?: boolean; }
export interface ParagraphOoxmlPlan { lineTwip?: number; lineRule?: "exact"|"auto"; leftTwip?: number; firstLineTwip?: number; beforeTwip?: number; afterTwip?: number; outlineLevel?: number; keepNext?: boolean; keepLines?: boolean; }
const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
/**
 * Word for Mac's insertOoxml implementation requires a package envelope,
 * rather than a bare w:p/w:tbl fragment.  Keep the envelope deliberately
 * small: the host merges the supplied document body into the active file.
 */
export function wrapInOoxmlPackage(bodyXml: string): string {
  return `<pkg:package xmlns:pkg="http://schemas.microsoft.com/office/2006/xmlPackage"><pkg:part pkg:name="/_rels/.rels" pkg:contentType="application/vnd.openxmlformats-package.relationships+xml" pkg:padding="512"><pkg:xmlData><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships></pkg:xmlData></pkg:part><pkg:part pkg:name="/word/document.xml" pkg:contentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"><pkg:xmlData><w:document xmlns:w="${W_NS}"><w:body>${bodyXml}</w:body></w:document></pkg:xmlData></pkg:part></pkg:package>`;
}
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const attr = (name: string, value: string | number) => `${name}="${esc(String(value))}"`;

export function buildRunOoxml(plan: RunPlan): string {
  const fonts = plan.asciiFont || plan.eastAsiaFont || plan.complexScriptFont ? `<w:rFonts${plan.asciiFont ? ` ${attr("w:ascii", plan.asciiFont)}` : ""}${plan.eastAsiaFont ? ` ${attr("w:eastAsia", plan.eastAsiaFont)}` : ""}${plan.asciiFont ? ` ${attr("w:hAnsi", plan.asciiFont)}` : ""}${plan.complexScriptFont ? ` ${attr("w:cs", plan.complexScriptFont)}` : ""}/>` : "";
  const props = [fonts, plan.bold ? "<w:b/>" : "", plan.italic ? "<w:i/>" : "", plan.underline ? '<w:u w:val="single"/>' : "", plan.color ? `<w:color ${attr("w:val", plan.color.replace(/^#/, ""))}/>` : "", plan.sizeHalfPoints ? `<w:sz ${attr("w:val", plan.sizeHalfPoints)}/>` : "", plan.eastAsiaSizeHalfPoints ? `<w:szCs ${attr("w:val", plan.eastAsiaSizeHalfPoints)}/>` : ""].join("");
  const text = plan.text === undefined ? "" : `<w:t xml:space="preserve">${esc(plan.text)}</w:t>`;
  return `<w:r xmlns:w="${W_NS}"><w:rPr>${props}</w:rPr>${text}</w:r>`;
}

export function buildParagraphOoxml(plan: ParagraphOoxmlPlan): string {
  const spacing = plan.lineTwip !== undefined ? `<w:spacing ${attr("w:line", plan.lineTwip)} ${attr("w:lineRule", plan.lineRule ?? "exact")}${plan.beforeTwip !== undefined ? ` ${attr("w:before", plan.beforeTwip)}` : ""}${plan.afterTwip !== undefined ? ` ${attr("w:after", plan.afterTwip)}` : ""}/>` : "";
  const ind = plan.leftTwip !== undefined || plan.firstLineTwip !== undefined ? `<w:ind${plan.leftTwip !== undefined ? ` ${attr("w:left", plan.leftTwip)}` : ""}${plan.firstLineTwip !== undefined ? ` ${attr("w:firstLine", plan.firstLineTwip)}` : ""}/>` : "";
  const props = `${plan.keepNext ? "<w:keepNext/>" : ""}${plan.keepLines ? "<w:keepLines/>" : ""}${spacing}${ind}${plan.outlineLevel !== undefined ? `<w:outlineLvl ${attr("w:val", plan.outlineLevel)}/>` : ""}`;
  return `<w:p xmlns:w="${W_NS}"><w:pPr>${props}</w:pPr></w:p>`;
}
