'use strict';

self.addEventListener('push', (event) => {
<<<<<<< HEAD
  debugger;
=======

>>>>>>> 06e69d76c9f9e47a337534b330aaabbaecdf9eef
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
