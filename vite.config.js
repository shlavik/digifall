import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1000,
  },
  plugins: [svelte()],
});
