// https://jscompress.com/
// https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/#icon
'use strict';
// very important
// https://github.com/deanhume/pwa-update-available
// https://developers.google.com/web/fundamentals/primers/service-workers/
var CACHE_NAME = 'bob-app-cache-v2.0.0';
var THREE_MONTHS_IN_SECONDS = 7776000;

var urlsToCache = [
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/offline.html',
  '/android-icon-192x192.png',
  '/android-icon-512x512.png',
  '/apple-icon.png',
  '/ms-icon-310x150.png',
  // '/android-icon-192x192-mono.png',
  '/BidOrBooFinalCover_8.png',
  '/safari-pinned-tab.svg',
  '/static/media/'
];

// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('activate', function(event) {
  // anything listed here will not be deleted
  var cacheWhitelist = [CACHE_NAME];
  // console.info('deleting bidorboo old caches');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return cacheNames.map(function(cacheName) {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          // console.info('deleting bidorboo old caches' + cacheName);
          return caches.delete(cacheName);
        }
      });
    }),
  );
});
// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // fetch(fontAwesomeReq).then((response) => {
      //   // console.info('putting fontawesome in cache');
      //   cache.put(fontAwesomeReq, response);
      // });
      // fetch(googleFontsReq).then((response) => {
      //   // console.info('putting google fonts in cache');
      //   cache.put(googleFontsReq, response);
      // });

      return cache.addAll(urlsToCache);
    }),
  );
});

// https://developers.google.com/web/fundamentals/primers/service-workers/

// cache then network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then(function(response) {
          // xxxx maybe we shouldn't cache all things check the impact here
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            // console.info('we didnt cached it -------------');
            // console.log({ response });
            // console.info('we cached it -------------end');
            return response;
          }

          var destinationReq = event.request.destination;
          if (destinationReq) {
            // // IMPORTANT: Clone the response. A response is a stream
            // // and because we want the browser to consume the response
            // // as well as the cache consuming the response, we need
            // // to clone it so we have two streams.
            var responseToCache = response.clone();

            switch (destinationReq) {
              case 'style':
              case 'font':
              case 'image': {
                // console.info('we cached it -------------');
                // console.info({ destinationReq });
                // console.info('we cached it -------------end');
                caches.open(CACHE_NAME).then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

                return response;
              }
              // All `XMLHttpRequest` or `fetch()` calls where
              // `Request.destination` is the empty string default value
              default: {
                return response;
              }
            }
          }

          return response;
        })
        .catch(function(e) {
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
    }),
  );
});

// https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour
// self.addEventListener('push', (event) => {
//   var data = event.data.json();

//   var title = data.title;

//   var options = {
//     body: data.body,
//     badge: '/android-icon-192x192-mono.png',
//     image: '/android-icon-192x192.png',
//     icon: '/android-icon-512x512.png',
//     data: data.urlToLaunch || 'https://www.bidorboo.ca',
//     actions: [{ action: 'viewUpdate', title: 'View Update' }],
//   };
//   if (data.tag) {
//     options.renotify = true;
//     options.tag = data.tag;
//   }
//   if (data.requireInteraction) {
//     options.requireInteraction = true;
//   }

//   event.waitUntil(self.registration.showNotification(title, options));
// });

// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   if (event.action === 'viewUpdate') {
//     event.waitUntil(clients.openWindow(event.notification.data));
//     return;
//   }
//   //this needs to change, need to come need to be dybamic
//   event.waitUntil(clients.openWindow(event.notification.data));
// });

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
