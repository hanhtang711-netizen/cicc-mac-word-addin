# Mac Word 实机验收（2026-09-05）

自动验证已通过：`npm test`（17 tests）、`npm run typecheck`、`npm run build`、`npm run manifest:validate`。

以下项目需要在安装 Microsoft Word for Mac 的机器上完成：

- [ ] 旁加载开发清单并显示“中金 Word”页签
- [ ] 正文样式仅修改当前选区
- [ ] 标题可被原生目录收录
- [ ] 宽图、窄图、双图容器为空白且无边框；粘贴行内图片后不改变图片内容
- [ ] 目录与图表目录可更新页码
- [ ] 以 Coal India 标准报告副本渲染并逐页视觉比对
