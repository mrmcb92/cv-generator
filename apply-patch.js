const fs = require('fs');
const path = require('path');

// 1. Modificare src/lib/processPhoto.ts
const processPhotoContent = `export async function processPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Fișierul selectat nu este o imagine validă.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Nu s-a putut inițializa contextul Canvas.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Eroare la încărcarea imaginii.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Eroare la citirea fișierului.'));
    reader.readAsDataURL(file);
  });
}
`;

// 2. Modificare public/sw.js
const swContent = `const CACHE_NAME = 'cv-generator-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/fonts/Roboto-Regular.ttf',
  '/fonts/Roboto-Bold.ttf',
  '/fonts/Roboto-Italic.ttf',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
`;

try {
  fs.writeFileSync(path.join(__dirname, 'src/lib/processPhoto.ts'), processPhotoContent);
  console.log('✓ Am actualizat src/lib/processPhoto.ts');

  fs.writeFileSync(path.join(__dirname, 'public/sw.js'), swContent);
  console.log('✓ Am actualizat public/sw.js');

  console.log('\nToate modificările au fost aplicate cu succes!');
} catch (err) {
  console.error('Eroare la scrierea fișierelor:', err);
}