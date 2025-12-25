// src/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs'; // Импортируем модуль fs для чтения файлов

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [react()],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    
    // 🔑 ДОБАВЛЕНИЕ КОНФИГУРАЦИИ HTTPS
    https: {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt'),
    },
    // ------------------------------------

    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      '/api': {
        target: 'https://172.20.10.7:8443',
        changeOrigin: true,
        secure: false, 
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
}));