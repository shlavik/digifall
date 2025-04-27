import { svelte } from "@sveltejs/vite-plugin-svelte";
import Autoprefixer from "autoprefixer";
import PostcssNested from "postcss-nested";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,svg,json,ttf,mp3,ogg,wav}"],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [PostcssNested, Autoprefixer],
    },
  },
});
