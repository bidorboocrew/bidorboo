import axios from 'axios';

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    send();
  }
};
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const send = () => {
  window.addEventListener('load', async () => {
    let registration;
    try {
      console.log('registering service worker');
      registration = await navigator.serviceWorker.register('sw.js', {
        scope: '/',
      });
      debugger;
      console.log('Service worker Registered \n');
    } catch (e) {
      debugger;
      console.error(e);
    }
    try {
      debugger;
      if (!registration) {
        return;
      }
      console.log('registering webpush');
      const vapidPublicKey = `${process.env.REACT_APP_VAPID_PUSH_PUBLIC_KEY}`;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log('WEBPUSH  Registered \n');
      const registeringWithServer = await axios.post('/api/push/register', {
        data: {
          subscription: JSON.stringify(subscription),
        },
      });
      debugger;
    } catch (e) {
      console.error(e);
    }

    debugger;
  });
};

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
