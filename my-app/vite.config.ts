import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Адрес вашего Go-бэкенда (например, http://localhost:8080)
const backendUrl = 'http://localhost:8082';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Анализ жанров текста',
        short_name: 'Жанры',
        description: 'Определение жанра по маркерным словам',
        theme_color: '#990000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/Genre_analysis_frontend/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}']
      }
    })
  ],
  base: '/Genre_analysis_frontend/', // ← Замените на имя вашего репозитория
  server: {
    // 💡 Решение CORS: Проксирование
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены на бэкенд
      '/api/v1': {
        target: backendUrl,
        changeOrigin: true,
        secure: false, 
        //rewrite: (path) => path.replace(/^\/api/, ''), // Удаляем префикс /api перед отправкой
      },
    }
  },
})