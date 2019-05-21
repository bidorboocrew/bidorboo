import axios from 'axios';

export const registerServiceWorker = async (vapidKey, shouldRegisterNewWebPushSubscription) => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('starting to setup the PWA');
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
    let doWeHaveAnExistingSW = false;
    // try {
    //   const fetchServiceWorker = await fetch('sw.js');
    //   if (fetchServiceWorker.status === 200) {
    //     doWeHaveAnExistingSW = true;
    //   }
    // } catch (e) {
    //   console.error('failed to get sw.js ' + e);
    // }
    let registration;
    let newWorker;
    let refreshing;
    try {
      console.log('registering service worker');
      if (!doWeHaveAnExistingSW) {
        function showUpdateBar() {
          let snackbar = document.getElementById('snackbar');
          snackbar.className = 'show';
        }
        // The click event on the pop up notification
        document.getElementById('reload').addEventListener('click', () => {
          newWorker && newWorker.postMessage({ action: 'skipWaiting' });
        });

        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        if (registration.waiting && registration.waiting.state === 'installed') {
          newWorker = registration.waiting;
          showUpdateBar();
        }

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          window.location.reload();
          refreshing = true;
        });

        console.log('Service worker Registered \n');

        // if (registration) {
        //   registration.addEventListener('updatefound', handleUpdate);

        //   // newWorker = await registration.update();
        //   debugger;
        //   const handleUpdate = () => {
        //     debugger;
        //     // An updated service worker has appeared in reg.installing!
        //     newWorker = registration.installing;
        //     // newWorker = registration;
        //     newWorker &&
        //       newWorker.addEventListener('statechange', () => {
        //         debugger;
        //         // Has service worker state changed?
        //         switch (newWorker.state) {
        //           case 'installed':
        //             // There is a new service worker available, show the notification
        //             if (navigator.serviceWorker.controller) {
        //               let notification = document.getElementById('updatePWANotification');
        //               notification.setAttribute(
        //                 'style',
        //                 'display:block;position:fixed;background:black;height:100px;right:0;bottom:5rem;z-index:999;padding:30px;padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px;color:white;font-weight:6',
        //               );
        //             }
        //             break;
        //         }
        //       });
        //     let refreshing;
        //     // The event listener that is fired when the service worker updates
        //     // Here we reload the page
        //     navigator.serviceWorker.addEventListener('controllerchange', function() {
        //       debugger;
        //       if (refreshing) return;
        //       window.location.reload();
        //       refreshing = true;
        //     });
        //   };
        //   // registration = await registration.update();
        // }
      }
    } catch (e) {
      console.error(e);
    }

    try {
      if (!registration) {
        console.log('could not register service worker or webpush \n');

        return;
      }
      if (!shouldRegisterNewWebPushSubscription) {
        console.log('User is not logged in or This user already have webpush subscription ');

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
