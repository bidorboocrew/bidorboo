import axios from 'axios';

export const registerServiceWorker = (vapidKey) => {
  // if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    send(vapidKey);
  }
  // }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const send = (vapidKey) => {
  window.addEventListener('load', async () => {
    let registration;
    try {
      console.log('registering service worker');
      registration = await navigator.serviceWorker.register('sw.js', {
        scope: '/',
      });
      console.log('Service worker Registered \n');

      registration = await registration.update();
    } catch (e) {
      console.error(e);
    }

    try {
      if (!registration) {
        console.log('could not register service worker or webpush \n');

        return;
      }

      console.log('registering webpush');
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log('WEBPUSH  Registered \n');
      await axios.post('/api/push/register', {
        data: {
          subscription: JSON.stringify(subscription),
        },
      });
    } catch (e) {
      console.error(e);
    }
  });
};

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
