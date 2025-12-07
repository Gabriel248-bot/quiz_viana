const CACHE_NAME = 'quiz-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // Adicione todos os seus ícones aqui
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalação: Cacheia todos os arquivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Busca: Serve o arquivo do cache se ele existir
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }
        // Nenhuma resposta no cache - busca na rede
        return fetch(event.request);
      })
  );
});