import { handleLayoutCommand, handleStyleCommand, handleTocCommand } from "./app/commandHandlers";

const styles = [
  ["bodyHeading1", "正文一级标题"], ["bodyHeading2", "正文二级标题"], ["bodyHeading3", "正文三级标题"],
  ["body", "正文"], ["bodyIndented", "正文（左缩进）"], ["bullet1", "一级项目符号"], ["bullet2", "二级项目符号"],
  ["chartTitle", "图表头"], ["sourceLine", "资料来源"],
] as const;

function addButton(parent: HTMLElement, label: string, action: () => Promise<void>) {
  const button = document.createElement("button"); button.type = "button"; button.textContent = label;
  button.addEventListener("click", () => void action()); parent.append(button);
}

export function mountTaskpane() {
  const styleRoot = document.querySelector<HTMLElement>("#style-buttons");
  const layoutRoot = document.querySelector<HTMLElement>("#layout-buttons");
  const tocRoot = document.querySelector<HTMLElement>("#toc-buttons");
  if (!styleRoot || !layoutRoot || !tocRoot) return;
  for (const [id, label] of styles) addButton(styleRoot, label, () => handleStyleCommand(id));
  addButton(layoutRoot, "宽图", () => handleLayoutCommand("wide")); addButton(layoutRoot, "窄图", () => handleLayoutCommand("narrow")); addButton(layoutRoot, "双图", () => handleLayoutCommand("double"));
  addButton(tocRoot, "目录", () => handleTocCommand("toc")); addButton(tocRoot, "图表目录", () => handleTocCommand("figures"));
}

if (typeof Office !== "undefined") Office.onReady(() => mountTaskpane());
