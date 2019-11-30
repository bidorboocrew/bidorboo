export const registerServiceWorker = async () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      return reject({ success: false });
    }
    if ('serviceWorker' in navigator) {
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
            console.info('could not register service worker');
            return reject({ success: false });
          }

          console.info('Service worker was successfully Registered');

          return resolve({ registration });
        } catch (e) {
          console.info('failed registering service worker' + e);
          return reject({ success: false });
        }
      });
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
