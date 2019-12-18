// https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour

const keys = require('../config/keys');
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:bidorboo@bidorboo.ca',
  keys.vapidPublicApiKey,
  keys.vapidPrivateApiKey
);

exports.WebPushNotifications = {
  sendJobAwaitingRequesterConfirmCompletionText: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} awaiting your confirmation!`,
          body: `Tasker is done ! Click for more details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
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
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} Was Cancelled!`,
          body: `It is cancelled! Click for more details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  pushNewJobInYourArea: async (targetUserPushSubscription, { requestTitle, urlToLaunch }) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `NEW ${requestTitle} request in your area!`,
          body: `Act fast, be the first to bid`,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
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
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} is Completed!`,
          body: `It is DONE! Click to Rate it`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  tellRequesterThatWeMarkedJobDone: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `BidOrBoo Marked ${requestTitle} as Complete because you did not act in 3 days.`,
          body: `Click to rate the tasker`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  tellRequesterToConfirmJob: async (
    targetUserPushSubscription,
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Confirm that ${requestTitle} is Completed!`,
          body: `Click to confirm completion and Rate the tasker`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
          requireInteraction: true,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
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
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} is Happening Soon!`,
          body: `It is happening soon! Click for more details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  pushYouAreAwarded: async (
    targetUserPushSubscription,
    { taskerDisplayName, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Good News ${taskerDisplayName} !`,
          body: `You have been awarded a job. click for details`,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
  sendPush: async (targetUserPushSubscription, { title, body, icon, urlToLaunch }) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title,
          body,
          icon: icon,
          urlToLaunch: urlToLaunch || 'https://www.bidorboo.ca',
          tag: urlToLaunch,
        });
        webpush.sendNotification(JSON.parse(targetUserPushSubscription), payload).catch((e) => {
          console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
        });
        return { success: true };
      } else {
        return { success: false, errorMsg: 'This user has not subscribed' };
      }
    } catch (e) {
      return e;
    }
  },
};
