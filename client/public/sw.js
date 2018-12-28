'use strict';

self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.log('[Service Worker] Push Received.');
  console.log('[Service Worker] Push had this data:', data);

  const title = data.title;
  const options = {
    body: data.body,
    icon:
      'https://res-console.cloudinary.com/hr6bwgs1p/thumbnails/v1/image/upload/v1545981752/QmlkT3JCb28vYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mg==/grid',
    badge: '/android-chrome-192x192.png',
    data: data.urlToLaunch || 'https://www.bidorboo.com',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();
  //this needs to change, need to come need to be dybamic
  event.waitUntil(clients.openWindow(event.notification.data));
});
