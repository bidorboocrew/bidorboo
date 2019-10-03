// https://jscompress.com/ compress xxxxx
// https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/#icon
'use strict';
// xxxxx fery important
// https://github.com/deanhume/pwa-update-available
// https://developers.google.com/web/fundamentals/primers/service-workers/
var CACHE_NAME = 'bob-app-cache-v9.0.0';
var THREE_MONTHS_IN_SECONDS = 7776000;
<<<<<<< Updated upstream
// var googleMapsReq = new Request(
//   'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places,geometry',
//   {
//     mode: 'no-cors',
//     headers: {
//       'Cache-Control': 'max-age=' + THREE_MONTHS_IN_SECONDS,
//     },
//   },
// );
var fontAwesomeReq = new Request('https://use.fontawesome.com/releases/v5.8.2/css/all.css', {
  mode: 'no-cors',
  headers: {
    'Cache-Control': 'max-age=' + THREE_MONTHS_IN_SECONDS,
=======
var googleMapsReq = new Request(
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places,geometry',
  {
    mode: 'no-cors',
    headers: {
      'Cache-Control': 'max-age=' + THREE_MONTHS_IN_SECONDS,
    },
>>>>>>> Stashed changes
  },
);
// var fontAwesomeReq = new Request('https://use.fontawesome.com/releases/v5.6.3/css/all.css', {
//   mode: 'no-cors',
//   headers: {
//     'Cache-Control': 'max-age=' + THREE_MONTHS_IN_SECONDS,
//   },
// });

var googleFontsReq = new Request(
  'https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700&display=swap',
  {
    mode: 'no-cors',
    headers: {
      'Cache-Control': 'max-age=' + THREE_MONTHS_IN_SECONDS,
    },
  },
);

var urlsToCache = [
  '/favicon.ico',
  '/offline.html',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon-60x60.png',
  '/apple-touch-icon-76x76.png',
  '/apple-touch-icon-120x120.png',
  '/apple-touch-icon-152x152.png',
  '/apple-touch-icon-180x180.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/mstile-70x70.png',
  '/mstile-144x144.png',
  '/mstile-150x150.png',
  '/mstile-310x150.png',
  '/mstile-310x310.png',
  '/android-chrome-192x192-mono.png'
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
      fetch(googleFontsReq).then((response) => {
        // console.info('putting google fonts in cache');
        cache.put(googleFontsReq, response);
      });

      return cache.addAll(urlsToCache);
    }),
  );
});

// https://developers.google.com/web/fundamentals/primers/service-workers/

// network then cache
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request).catch(function() {
//       if (event.request.headers.get('accept').includes('text/html')) {
//         return caches.match('/offline.html');
//       }
//     }),
//   );
// });

// cache then network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        // console.info('returned from cache ' + response);
        return response;
      }
      return fetch(event.request)
        .then(function(response) {
          // xxxx maybe we shouldnt cache all thigns check the impact here
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
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
self.addEventListener('push', (event) => {
  var data = event.data.json();

  var title = data.title;
  var options = {
    body: data.body,
    icon: 'android-chrome-192x192.png',
    badge: 'android-chrome-192x192-mono.png',
    image: 'mstile-310x310.png',
    data: data.urlToLaunch || 'https://www.bidorboo.com',
    actions: [{ action: 'viewUpdate', title: 'View Update' }],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'viewUpdate') {
    event.waitUntil(clients.openWindow(event.notification.data));
    return;
  }
  //this needs to change, need to come need to be dybamic
  event.waitUntil(clients.openWindow(event.notification.data));
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
