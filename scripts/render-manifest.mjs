import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderManifest } from "./render-manifest-lib.mjs";
const [baseUrl, outputPath] = process.argv.slice(2);
if (!baseUrl || !outputPath) throw new Error("Usage: node scripts/render-manifest.mjs <base-url> <output-path>");
const template = await readFile(resolve(import.meta.dirname, "../manifest/manifest.template.xml"), "utf8");
await writeFile(resolve(import.meta.dirname, "..", outputPath), renderManifest(template, baseUrl), "utf8");
