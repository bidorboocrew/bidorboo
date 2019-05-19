'use strict';

// https://developers.google.com/web/fundamentals/primers/service-workers/
var CACHE_NAME = 'bob-app-cache-v1.1.3';
var urlsToCache = ['/', '/android-chrome-192x192.png', '/logo.svg'];
var thirdPartyCachedLibs = [
  () => new Request('https://js.stripe.com/v3/', { mode: 'no-cors' }),
  () =>
    new Request(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places,geometry',
      { mode: 'no-cors' },
    ),
  () => new Request('https://use.fontawesome.com/releases/v5.6.3/css/all.css', { mode: 'no-cors' }),
];

// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('activate', function(event) {
  // anything listed here will not be deleted
  var cacheWhitelist = ['bob-app-cache-v1.1.3'];
  console.log('deleting caches ');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('deleting caches ' + urlsToCache);
            return caches.delete(urlsToCache);
          }
        }),
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('deleting 3rd party caches ' + thirdPartyCachedLibs);
            return caches.delete(thirdPartyCachedLibs);
          }
        }),
      );
    }),
  );
});
// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return Promise.all([
        () => cache.addAll(urlsToCache),
        () => cache.addAll(thirdPartyCachedLibs),
      ]);
    }),
  );
});

// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        // xxxx maybe we shouldnt cache all thigns check the impact here
        // Check if we received a valid response
        return response;
        // if (!response || response.status !== 200 || response.type !== 'basic') {
        //   return response;
        // }

        // // IMPORTANT: Clone the response. A response is a stream
        // // and because we want the browser to consume the response
        // // as well as the cache consuming the response, we need
        // // to clone it so we have two streams.
        // var responseToCache = response.clone();

        // caches.open(CACHE_NAME).then(function(cache) {
        //   cache.put(event.request, responseToCache);
        // });

        // return response;
      });
    }),
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    data: data.urlToLaunch || 'https://www.bidorboo.com',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  //this needs to change, need to come need to be dybamic
  event.waitUntil(clients.openWindow(event.notification.data));
});
