import { WordGateway } from "../office/wordGateway";
import type { CICCStyleId } from "../styles/ciccTokens";
import type { LayoutKind } from "../layout/layoutPlanner";
import type { TocKind } from "../toc/tocPlanner";
import { PaneFeedback, type UserFeedback } from "./userFeedback";

export interface CommandDependencies { gateway: Pick<WordGateway, "applySelectionStyle"|"insertLayout"|"insertOrUpdateToc">; feedback: UserFeedback; }
export type CommandEvent = { completed?: () => void } | undefined;

export function createHandlers(deps: CommandDependencies) {
  const run = async (action: () => Promise<void>, success: string, event?: CommandEvent) => { try { await action(); deps.feedback.success(success); } catch (error) { deps.feedback.error(error instanceof Error ? error.message : String(error)); } finally { event?.completed?.(); } };
  const style = (id: CICCStyleId, label: string, event?: CommandEvent) => run(() => deps.gateway.applySelectionStyle(id), `已应用${label}`, event);
  const layout = (kind: LayoutKind, label: string, event?: CommandEvent) => run(() => deps.gateway.insertLayout(kind), `已插入${label}空白容器`, event);
  const toc = (kind: TocKind, label: string, event?: CommandEvent) => run(() => deps.gateway.insertOrUpdateToc(kind), `已插入或更新${label}`, event);
  return {
    applyHeading1: (e?: CommandEvent) => style("bodyHeading1", "正文一级标题", e), applyHeading2: (e?: CommandEvent) => style("bodyHeading2", "正文二级标题", e), applyHeading3: (e?: CommandEvent) => style("bodyHeading3", "正文三级标题", e), applyBody: (e?: CommandEvent) => style("body", "正文", e), applyIndentedBody: (e?: CommandEvent) => style("bodyIndented", "正文（左缩进）", e), applyBullet1: (e?: CommandEvent) => style("bullet1", "一级项目符号", e), applyBullet2: (e?: CommandEvent) => style("bullet2", "二级项目符号", e), applyChartTitle: (e?: CommandEvent) => style("chartTitle", "图表头", e), applySourceLine: (e?: CommandEvent) => style("sourceLine", "资料来源", e),
    insertWideLayout: (e?: CommandEvent) => layout("wide", "宽图", e), insertNarrowLayout: (e?: CommandEvent) => layout("narrow", "窄图", e), insertDoubleLayout: (e?: CommandEvent) => layout("double", "双图", e),
    insertToc: (e?: CommandEvent) => toc("toc", "目录", e), insertFiguresToc: (e?: CommandEvent) => toc("figures", "图表目录", e),
  };
}

let handlers: ReturnType<typeof createHandlers> | undefined;
let gateway: WordGateway | undefined;
const getGateway = () => gateway ??= new WordGateway();
export function getHandlers() { return handlers ??= createHandlers({ gateway: getGateway(), feedback: new PaneFeedback() }); }
export const enablePictureAutoFit = () => getGateway().enablePictureAutoFit();
export function registerCommandHandlers() { const h = getHandlers(); Object.assign(globalThis, h); return h; }
export const handleStyleCommand = (id: Exclude<CICCStyleId, "tocHeading"|"toc1"|"toc2"|"tableOfFigures">) => getHandlers()[({ bodyHeading1: "applyHeading1", bodyHeading2: "applyHeading2", bodyHeading3: "applyHeading3", body: "applyBody", bodyIndented: "applyIndentedBody", bullet1: "applyBullet1", bullet2: "applyBullet2", chartTitle: "applyChartTitle", sourceLine: "applySourceLine" } as const)[id]]();
export const handleLayoutCommand = (kind: LayoutKind) => getHandlers()[({ wide: "insertWideLayout", narrow: "insertNarrowLayout", double: "insertDoubleLayout" } as const)[kind]]();
export const handleTocCommand = (kind: TocKind) => getHandlers()[({ toc: "insertToc", figures: "insertFiguresToc" } as const)[kind]]();
