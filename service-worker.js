// ===============================
// Karuizawa Trip PWA Service Worker
// UI-safe version
// ===============================

const CACHE_VERSION = 'karuizawa-v3'; // 👈 之後 UI 有改，只要改這行
const APP_ASSETS = [
  './',
  'index.html',
  'flight.html',
  'itinerary.html',
  'hotel.html',
  'packing.html',
  'emergency.html',
  'style.css',
  'app.js',
  'manifest.json'
];

// 安裝：快取必要檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(APP_ASSETS);
    })
  );
  self.skipWaiting(); // 立即啟用新 SW
});

// 啟用：清除舊版本 cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 抓取策略：
// HTML / CSS / JS → Network First（確保 UI 更新）
// 失敗才用 cache
self.addEventListener('fetch', event => {
  const req = event.request;

  // 只處理同源請求
  if (!req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(req, resClone);
        });
        return res;
      })
      .catch(() => caches.match(req))
  );
});
