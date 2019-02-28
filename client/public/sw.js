'use strict';

self.addEventListener('push', (event) => {
  const data = event.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: '/rsz_1surveymonkey-logo.png',
    badge: '/rsz_1surveymonkey-logo.png',
    data: data.urlToLaunch || 'https://www.bidorboo.com',
    actions: [
         {action: 'mint', title: 'Mint'},
         {action: 'maple bacon', title: 'Maple Bacon'},
         {action: 'protein', title: 'Protein'},
         {action: 'spicy taco', title: 'Spicy Taco'}]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});



self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'like') {
        silentlyLikeItem();
      }
      else if (event.action === 'spicy taco') {
        clients.openWindow("/fakeSurvey1");
      }
      else {
        clients.openWindow("/messages?reply=" + messageId);
      }
  // this needs to change, need to come need to be dybamic
  event.waitUntil(clients.openWindow(event.notification.data));
});
