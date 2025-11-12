// src/sw.ts
const CACHE_NAME = 'genre-app-v1';
const urlsToCache = [
  '/Genre_analysis_frontend/',
  '/Genre_analysis_frontend/index.html',
  '/Genre_analysis_frontend/manifest.json',
  // Добавьте основные стили, изображения
  '/Genre_analysis_frontend/src/img/back.jpg',
  '/Genre_analysis_frontend/src/img/Home.png',
  '/Genre_analysis_frontend/src/img/RequestIcon.png',
];

self.addEventListener('install', (e: any) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (e: any) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});