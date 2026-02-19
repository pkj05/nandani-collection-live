// public/sw.js
self.addEventListener('install', () => {
  console.log('Nandani App Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // PWA requirements ke liye fetch handler hona zaroori hai
});