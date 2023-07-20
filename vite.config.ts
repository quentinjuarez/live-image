import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { dirname, join, relative, resolve } from "path";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(join(__dirname, "src")),
    },
  },
  plugins: [
    vue(),
    crx({ manifest }),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables/", "src/popup/store/"],
    }),
  ],
});
