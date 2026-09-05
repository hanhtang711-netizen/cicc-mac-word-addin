import { resolve } from "node:path";
import { defineConfig } from "vite";
import { getHttpsServerOptions } from "office-addin-dev-certs";

export default defineConfig(async ({ command }) => ({
  server: { ...(command === "serve" && process.env.VITEST === undefined ? { https: await getHttpsServerOptions() } : {}), port: 3000, strictPort: true },
  test: { environment: "jsdom" },
  build: { rollupOptions: { input: { commands: resolve(import.meta.dirname, "commands.html"), taskpane: resolve(import.meta.dirname, "taskpane.html") } } },
}));
