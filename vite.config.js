import { svelte } from "@sveltejs/vite-plugin-svelte";
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
});
