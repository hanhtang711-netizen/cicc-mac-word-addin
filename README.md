# 中金 Word 工具（Mac）

独立的 Microsoft Word for Mac Office.js 加载项，复刻 CICC 正文写作样式、图表/图片空白容器与原生动态目录。视觉基准为 Coal India 标准报告；仓库不含原始安装包或专有示例图片。

## 功能

- 正文一级/二级/三级标题、正文、左缩进正文、两级项目符号；
- 图表头、资料来源；
- 宽图、窄图、双图：插入无边框空白容器，用户自行粘贴行内图片或图表；
- 原生动态目录、图表目录。

## 开发

```bash
npm install
npm run dev
npm run manifest:dev
```

然后按 [docs/INSTALL_MAC.md](docs/INSTALL_MAC.md) 旁加载到 Word for Mac。完整回归见 [docs/TEST_CHECKLIST.md](docs/TEST_CHECKLIST.md)。
