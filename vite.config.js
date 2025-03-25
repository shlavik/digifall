import { svelte } from "@sveltejs/vite-plugin-svelte";
import Autoprefixer from "autoprefixer";
import PostcssNested from "postcss-nested";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1337,
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        bigint: true,
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4,
        },
        immutable: false,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [Autoprefixer, PostcssNested],
    },
  },
});
