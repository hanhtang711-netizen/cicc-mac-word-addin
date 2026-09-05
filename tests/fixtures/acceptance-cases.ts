export const acceptanceCases = [
  { id: "heading-selection", action: "select text and apply 正文一级标题", expected: "Heading 1 outline with #640000 16pt and 1000 twip indent" },
  { id: "body-selection", action: "select text and apply 正文", expected: "Arial/黑体 9.5pt/10pt with exact 14.5pt line spacing" },
  { id: "blank-layouts", action: "insert 宽图、窄图、双图", expected: "blank borderless 1x3/1x3/2x3 containers" },
  { id: "native-toc", action: "insert or update 目录与图表目录", expected: "native TOC fields update page numbers" },
] as const;
