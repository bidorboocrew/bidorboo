const keys = require('../config/keys');
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:bidorboocrew@gmail.com',
  keys.vapidPublicApiKey,
  keys.vapidPrivateApiKey
);

exports.WebPushNotifications = {
  sendJobAwaitingRequesterConfirmCompletionText: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `BidOrBoo: ${requestTitle} awaiting your confirmation!`,
          body: `Tasker is done ! Click for more details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        await webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload);
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  pushAwardedJobWasCancelled: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `BidOrBoo: ${requestTitle} Was Cancelled!`,
          body: `It is cancelled! Click for more details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        await webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload);
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  pushAwardedJobWasCompleted: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `BidOrBoo: ${requestTitle} is Completed!`,
          body: `It is DONE! Click to Rate it`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        await webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload);
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  pushJobIsHappeningSoon: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `BidOrBoo: ${requestTitle} is Happening Soon!`,
          body: `It is happening soon! Click for more details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        await webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload);
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  pushYouAreAwarded: async (targetUserPushSubscription, { displayName, icon, urlToLaunch }) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Good News ${displayName} !`,
          body: `You have been awarded a job. click for details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        await webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload);
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  sendPush: async (targetUserPushSubscription, { title, body, icon, urlToLaunch }) => {
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title,
          body,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.com',
        });
        await webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload);
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
};
