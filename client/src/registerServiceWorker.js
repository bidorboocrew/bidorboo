import axios from 'axios';

export const registerServiceWorker = async (vapidKey, shouldRegisterNewWebPushSubscription) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.info('starting to setup the PWA');
    installSW(vapidKey, shouldRegisterNewWebPushSubscription);
  }
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

const installSW = (vapidKey, shouldRegisterNewWebPushSubscription) => {
  window.addEventListener('load', async () => {
    let registration;
    let newWorker;
    let refreshing;
    try {
      function showUpdateBar() {
        // https://github.com/deanhume/pwa-update-available
        let snackbar = document.getElementById('snackbar');
        snackbar.className = 'show';
      }
      // The click event on the pop up notification
      document.getElementById('reload').addEventListener('click', () => {
        if (newWorker && newWorker.postMessage) {
          newWorker.postMessage({ action: 'skipWaiting' });
        }
      });

      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      if (registration.waiting && registration.waiting.state === 'installed') {
        newWorker = registration.waiting;
        showUpdateBar();
      }

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) {
          return;
        }
        refreshing = true;
        window.location.reload();
      });

      if (!registration) {
        console.info('could not register service worker or webpush');
        return;
      }

      console.info('Service worker was successfully Registered');

      if (shouldRegisterNewWebPushSubscription) {
        console.info('kick start registering webpush');
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        console.info('WEBPUSH  Registered');

        await axios.post('/api/push/register', {
          data: {
            subscription: JSON.stringify(subscription),
          },
        });
        return;
      }
    } catch (e) {
      console.info('failed registering webpush ' + e);
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
