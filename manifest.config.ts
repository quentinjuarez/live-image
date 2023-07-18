import { defineManifest } from "@crxjs/vite-plugin";
// @ts-ignore
import packageJson from "./package.json";

const { version, name } = packageJson;

export default defineManifest(async (env) => ({
  name: env.mode === "staging" ? `[INTERNAL] ${name}` : name,
  version: version,
  version_name: version,
  manifest_version: 3,
  // key: 'ekgmcbpgglflmgcfajnglpbcbdccnnje',
  action: {
    default_popup: "src/popup/index.html",
  },
  background: {
    service_worker: "src/serviceWorker/index.ts",
  },
  content_scripts: [
    {
      js: ["src/contentScript/index.ts"],
      matches: ["*://*/*"],
    },
  ],
  host_permissions: ["*://*/*"],
  options_page: "src/options/index.html",
  permissions: ["storage", "activeTab", "identity", "contextMenus"],
  web_accessible_resources: [
    {
      matches: ["*://*/*"],
      resources: ["src/contentScript/index.ts"],
    },
  ],
}));
