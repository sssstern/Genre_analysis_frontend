import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Адрес вашего Go-бэкенда (например, http://localhost:8080)
const backendUrl = 'http://localhost:8082';

// https://vite.dev/config/
export default defineConfig({
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
  plugins: [
    react(),
  ],
})
