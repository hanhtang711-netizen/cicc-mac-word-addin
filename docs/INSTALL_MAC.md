# Mac Word 安装与旁加载

1. 在项目目录运行 `npm install`。
2. 运行 `npm run dev`，保留 HTTPS 开发服务器。
3. 运行 `npm run manifest:dev` 生成开发清单。
4. Word for Mac → 工具 → Word 加载项 → 管理我的加载项 → 上传 `manifest/manifest.dev.xml`。
5. 在“中金 Word”页签打开“中金 Word 工具”。

开发清单只连接本机 `https://localhost:3000`。发布时使用 `npm run release -- --base-url https://your-domain.example --out release`，不要把标准 DOCX、EXE 或示例图表放入仓库。
