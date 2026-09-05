export interface RunPlan { text?: string; asciiFont?: string; eastAsiaFont?: string; complexScriptFont?: string; sizeHalfPoints?: number; eastAsiaSizeHalfPoints?: number; color?: string; bold?: boolean; italic?: boolean; underline?: boolean; }
export interface ParagraphOoxmlPlan { lineTwip?: number; lineRule?: "exact"|"auto"; leftTwip?: number; firstLineTwip?: number; beforeTwip?: number; afterTwip?: number; outlineLevel?: number; keepNext?: boolean; keepLines?: boolean; }
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const attr = (name: string, value: string | number) => `${name}="${esc(String(value))}"`;

export function buildRunOoxml(plan: RunPlan): string {
  const fonts = plan.asciiFont || plan.eastAsiaFont || plan.complexScriptFont ? `<w:rFonts${plan.asciiFont ? ` ${attr("w:ascii", plan.asciiFont)}` : ""}${plan.eastAsiaFont ? ` ${attr("w:eastAsia", plan.eastAsiaFont)}` : ""}${plan.asciiFont ? ` ${attr("w:hAnsi", plan.asciiFont)}` : ""}${plan.complexScriptFont ? ` ${attr("w:cs", plan.complexScriptFont)}` : ""}/>` : "";
  const props = [fonts, plan.bold ? "<w:b/>" : "", plan.italic ? "<w:i/>" : "", plan.underline ? '<w:u w:val="single"/>' : "", plan.color ? `<w:color ${attr("w:val", plan.color.replace(/^#/, ""))}/>` : "", plan.sizeHalfPoints ? `<w:sz ${attr("w:val", plan.sizeHalfPoints)}/>` : "", plan.eastAsiaSizeHalfPoints ? `<w:szCs ${attr("w:val", plan.eastAsiaSizeHalfPoints)}/>` : ""].join("");
  const text = plan.text === undefined ? "" : `<w:t xml:space="preserve">${esc(plan.text)}</w:t>`;
  return `<w:r><w:rPr>${props}</w:rPr>${text}</w:r>`;
}

export function buildParagraphOoxml(plan: ParagraphOoxmlPlan): string {
  const spacing = plan.lineTwip !== undefined ? `<w:spacing ${attr("w:line", plan.lineTwip)} ${attr("w:lineRule", plan.lineRule ?? "exact")}${plan.beforeTwip !== undefined ? ` ${attr("w:before", plan.beforeTwip)}` : ""}${plan.afterTwip !== undefined ? ` ${attr("w:after", plan.afterTwip)}` : ""}/>` : "";
  const ind = plan.leftTwip !== undefined || plan.firstLineTwip !== undefined ? `<w:ind${plan.leftTwip !== undefined ? ` ${attr("w:left", plan.leftTwip)}` : ""}${plan.firstLineTwip !== undefined ? ` ${attr("w:firstLine", plan.firstLineTwip)}` : ""}/>` : "";
  const props = `${plan.keepNext ? "<w:keepNext/>" : ""}${plan.keepLines ? "<w:keepLines/>" : ""}${spacing}${ind}${plan.outlineLevel !== undefined ? `<w:outlineLvl ${attr("w:val", plan.outlineLevel)}/>` : ""}`;
  return `<w:p><w:pPr>${props}</w:pPr></w:p>`;
}
