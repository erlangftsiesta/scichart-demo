import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "Logo.png",
      ],
      workbox: {
        sourcemap: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 5242880,
      },
      manifest: {
        name: "SciChart Demo PWA",
        short_name: "SciChartPWA",
        description: "SciChart Demo App with PWA capabilities",
        theme_color: "#ffffff",
        icons: [
          {
            src: "Logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "Logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
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