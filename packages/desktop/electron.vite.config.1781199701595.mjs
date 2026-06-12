// electron.vite.config.ts
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "electron-vite";
import appPlugin from "@nexusflow/app/vite";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
var __electron_vite_injected_import_meta_url = "file:///D:/github/mywork/opencode-dev/packages/desktop/electron.vite.config.ts";
var NEXUSFLOW_SERVER_DIST = "../nexusflow/dist/node";
var NEXUSFLOW_SERVER_MODULE = "\0nexusflow:server";
function copyServerAssets() {
  return {
    name: "nexusflow:copy-server-assets",
    async writeBundle() {
      await fs.mkdir("./out/main/chunks", { recursive: true });
      await fs.copyFile(`${NEXUSFLOW_SERVER_DIST}/node.js`, "./out/main/chunks/nexusflow-server.js");
      for (const l of await fs.readdir(NEXUSFLOW_SERVER_DIST)) {
        if (!l.endsWith(".wasm")) continue;
        await fs.writeFile(`./out/main/chunks/${l}`, await fs.readFile(`${NEXUSFLOW_SERVER_DIST}/${l}`));
      }
    }
  };
}
var channel = (() => {
  const raw = process.env.NEXUSFLOW_CHANNEL;
  if (raw === "dev" || raw === "beta" || raw === "prod") return raw;
  if (process.env.NEXUSFLOW_CHANNEL === "latest") return "prod";
  return "dev";
})();
var nodePtyPkg = `@lydell/node-pty-${process.platform}-${process.arch}`;
var sentry = process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT ? sentryVitePlugin({
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  telemetry: false,
  release: { name: process.env.SENTRY_RELEASE ?? process.env.VITE_SENTRY_RELEASE },
  sourcemaps: { assets: "./out/renderer/**", filesToDeleteAfterUpload: "./out/renderer/**/*.map" }
}) : false;
var electron_vite_config_default = defineConfig({
  main: {
    define: { "import.meta.env.NEXUSFLOW_CHANNEL": JSON.stringify(channel) },
    build: {
      rollupOptions: {
        input: { index: "src/main/index.ts", sidecar: "src/main/sidecar.ts" },
        external: ["nexusflow-web-ui.gen.ts"]
      },
      externalizeDeps: { include: [nodePtyPkg] }
    },
    esbuild: { jsx: "automatic", jsxImportSource: "solid-js" },
    plugins: [
      {
        name: "nexusflow:node-pty-narrower",
        enforce: "pre",
        resolveId(s) {
          if (s === "@lydell/node-pty") return nodePtyPkg;
        }
      },
      {
        name: "nexusflow:clear-server-assets",
        async buildStart() {
          for (const l of await fs.readdir("./out/main/chunks").catch(() => [])) {
            if (l !== "nexusflow-server.js" && !l.endsWith(".wasm")) continue;
            await fs.rm(`./out/main/chunks/${l}`, { force: true });
          }
        }
      },
      {
        name: "nexusflow:virtual-server-module",
        enforce: "pre",
        resolveId(id) {
          if (id === "virtual:nexusflow-server") return NEXUSFLOW_SERVER_MODULE;
        },
        load(id) {
          if (id !== NEXUSFLOW_SERVER_MODULE) return;
          return `
const server = await import(new URL("./nexusflow-server.js", import.meta.url).href)
export const bootstrap = server.bootstrap
export const Config = server.Config
export const Database = server.Database
export const JsonMigration = server.JsonMigration
export const Log = server.Log
export const Server = server.Server
`;
        }
      }
    ]
  },
  preload: {
    build: {
      rollupOptions: {
        input: { index: "src/preload/index.ts" },
        output: { format: "cjs", entryFileNames: "[name].js" }
      }
    }
  },
  renderer: {
    esbuild: { jsx: "automatic", jsxImportSource: "solid-js" },
    plugins: [appPlugin, sentry, copyServerAssets()],
    publicDir: "../../../app/public",
    root: "src/renderer",
    resolve: {
      alias: {
        "monaco-editor": fileURLToPath(new URL("./src/renderer/monaco-editor-stub.ts", __electron_vite_injected_import_meta_url))
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: { main: "src/renderer/index.html", loading: "src/renderer/loading.html" }
      }
    }
  }
});
export {
  electron_vite_config_default as default
};
