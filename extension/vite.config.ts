import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  return {
    base: "./",
    plugins: [vue(), tailwindcss()],
    define: {
      "process.env": {
        FRONT_URL:
          mode === "development"
            ? "http://localhost:5173"
            : "https://live-image-overlay.vercel.app",
      },
    },
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
  };
});
