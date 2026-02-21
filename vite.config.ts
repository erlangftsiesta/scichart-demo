import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "btc.svg",
      ],
      workbox: {
        sourcemap: true,
        globPatterns: ["**/*.{css,html,png,svg}"],
        maximumFileSizeToCacheInBytes: 5242880,
      },
      manifest: {
        name: "SciChart Demo",
        short_name: "SciChartDemo",
        description: "SciChart Demo App",
        theme_color: "#131722",
        icons: [
          {
            src: "btc.svg",
            sizes: "192x192",
            type: "image/svg",
          },
          {
            src: "btc.svg",
            sizes: "512x512",
            type: "image/svg",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/scichart/_wasm/scichart2d.wasm",
          dest: "",
        },
        {
          src: "node_modules/scichart/_wasm/scichart3d.wasm",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          scichart: ["scichart", "scichart-react"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          vendor: ["react", "react-dom", "rxjs"],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  server: {
    open: true,
    allowedHosts: true,
  },
});