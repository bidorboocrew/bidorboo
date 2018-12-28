const keys = require('../config/keys');
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:bidorboocrew@gmail.com',
  keys.vapidPublicApiKey,
  keys.vapidPrivateApiKey
);

exports.WebPushNotifications = {
  sendPush: async (targetUserPushSubscription, { title, body, icon, urlToLaunch }) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title,
          body,
          icon: icon || 'https://image.flaticon.com/icons/svg/753/753078.svg',
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        const sendWebPush = await webpush.sendNotification(
          JSON.parse(targetUserPushSubscription),
          payload
        );
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
};
