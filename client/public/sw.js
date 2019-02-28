'use strict';
const ProposerRoot = require('../src/containers/proposer-flow/ProposerRootPage')

self.addEventListener('push', (event) => {
  const data = event.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: '/rsz_1surveymonkey-logo.png',
    badge: '/rsz_1surveymonkey-logo.png',
    data: data.urlToLaunch || 'https://www.bidorboo.com',
    actions: [
      {action: 'spicy taco', title: '🌮 Spicy Taco'},
      {action: 'maple bacon', title: '🥓 Maple Bacon'}]
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
