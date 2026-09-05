import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { renderManifest } from "./render-manifest-lib.mjs";
const exec = promisify(execFile); const root = resolve(import.meta.dirname, "..");
function parse(argv) { if (argv.length !== 4 || argv[0] !== "--base-url" || argv[2] !== "--out") throw new Error("Usage: npm run release -- --base-url <https-origin> --out <directory>"); return { baseUrl: argv[1], out: resolve(root, argv[3]) }; }
const { baseUrl, out } = parse(process.argv.slice(2));
const url = new URL(baseUrl); if (url.protocol !== "https:" || /localhost|127\.0\.0\.1/.test(url.hostname) || url.pathname !== "/" || url.username || url.password) throw new Error("Production base URL must be a fixed, non-local HTTPS origin");
await exec(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], { cwd: root });
if (!(await stat(resolve(root, "dist")).catch(() => undefined))?.isDirectory()) throw new Error("Static build is missing");
await mkdir(out, { recursive: true }); await cp(resolve(root, "dist"), resolve(out, "site"), { recursive: true });
const template = await readFile(resolve(root, "manifest/manifest.template.xml"), "utf8"); await writeFile(resolve(out, "manifest.production.xml"), renderManifest(template, url.origin), "utf8");
console.log(`Release site: ${resolve(out, "site")}\nProduction manifest: ${resolve(out, "manifest.production.xml")}`);
