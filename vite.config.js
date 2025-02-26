import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

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
});
