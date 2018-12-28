'use strict';

self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.log('[Service Worker] Push Received.');
  console.log('[Service Worker] Push had this data:', data);

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
    // badge: 'images/badge.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  const data = event.data.json();

  event.notification.close();
  //this needs to change, need to come need to be dybamic
  event.waitUntil(clients.openWindow(data.urlToLaunch));
});
