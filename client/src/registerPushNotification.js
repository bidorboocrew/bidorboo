import axios from 'axios';
/**
 * can only register push notification after registering service worker
 * @param {*} vapidKey
 * @param {*} shouldRegisterNewWebPushSubscription
 */

//  https://web-push-book.gauntface.com/
export const registerPushNotification = (vapidKey, registration) => {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      return reject({ success: false });
    }
    // https://medium.com/better-programming/everything-you-need-to-know-about-pwas-push-notifications-e870bb54e14f
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      try {
        const results = await window.Notification.requestPermission();
        if (results === 'granted') {
          console.info('Starting push notifications registration');
          const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
          console.info('push notifications active');

          await axios.post('/api/push/register', {
            data: {
              subscription: JSON.stringify(subscription),
            },
          });
          return resolve({ success: true });
        } else {
          return reject({ success: false });
        }
      } catch (e) {
        console.info(`couldn't register push notifications`);
        return reject({ success: false });
      }
    }
    return reject({ success: false });
  });
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

export const unregisterPushNotification = (registration) => {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      return reject({ success: false });
    }
    // https://medium.com/better-programming/everything-you-need-to-know-about-pwas-push-notifications-e870bb54e14f
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      try {
        console.info('unregistering push notifications');

        const subscription = await registration.pushManager.getSubscription();
        console.info('push notifications currently active');
        if (subscription) {
          // TODO: Tell application server to delete subscription
          subscription.unsubscribe();
        }
        await axios.post('/api/push/register', {
          data: {
            subscription: '',
          },
        });
        console.info('push notifications deactivated');
        return resolve({ success: true });
      } catch (e) {
        console.info(`couldn't unregister push notifications`);
        return reject({ success: false });
      }
    }
    return resolve({ success: true });
  });
};
