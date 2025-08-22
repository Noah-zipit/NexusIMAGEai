/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

// App version to help with cache busting
const APP_VERSION = '1.0.0';

// Cache names
const CACHE_NAMES = {
  static: `nexus-static-${APP_VERSION}`,
  dynamic: `nexus-dynamic-${APP_VERSION}`,
  images: `nexus-images-${APP_VERSION}`
};

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any cache that doesn't match our current cache names
          const isOldCache = !Object.values(CACHE_NAMES).includes(cacheName);
          if (isOldCache) {
            return caches.delete(cacheName);
          }
          return null;
        }).filter(Boolean)
      );
    })
  );
  
  // Claim clients so the SW is in effect immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and API calls
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }
  
  // Special handling for image files
  if (isImageRequest(event.request)) {
    return event.respondWith(
      cacheFirst(event.request, CACHE_NAMES.images)
    );
  }
  
  // HTML navigation requests - network-first approach
  if (event.request.mode === 'navigate') {
    return event.respondWith(
      networkFirst(event.request, CACHE_NAMES.static)
    );
  }
  
  // All other static assets - cache-first approach
  event.respondWith(
    cacheFirst(event.request, CACHE_NAMES.static)
  );
});

// Network first strategy (for HTML)
async function networkFirst(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    // Return cached response or offline fallback
    return cachedResponse || caches.match('/offline.html');
  }
}

// Cache first strategy (for static assets)
async function cacheFirst(request, cacheName) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If it's an image, return a placeholder
    if (isImageRequest(request)) {
      return caches.match('/placeholder-image.png');
    }
    
    // Otherwise, the request failed
    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
}

// Check if the request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  return (
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg')
  );
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New notification',
    icon: '/logo192.png',
    badge: '/badge.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nexus Image Gen', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window with this URL open
      const existingClient = windowClients.find((client) => {
        return new URL(client.url).pathname === new URL(urlToOpen).pathname;
      });
      
      // If so, focus it
      if (existingClient) {
        return existingClient.focus();
      }
      
      // Otherwise, open a new window
      return clients.openWindow(urlToOpen);
    })
  );
});