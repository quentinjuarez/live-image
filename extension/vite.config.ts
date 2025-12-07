import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup/index.html"),
      },
      output: {
        entryFileNames: "popup/[name].js",
        chunkFileNames: "popup/[name].js",
        assetFileNames: "popup/[name].[ext]",
      },
    },
  },
});
