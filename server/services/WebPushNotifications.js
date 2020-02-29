// https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour

const keys = require('../config/keys');

const OneSignal = require('onesignal-node');
const OneSignalClient = new OneSignal.Client(keys.onesignalPublicKey, keys.onesignalSecretKey);

const webpush = require('web-push');
const { bugsnagClient } = require('../utils/utilities');
webpush.setVapidDetails(
  'mailto:bidorboo@bidorboo.ca',
  keys.vapidPublicApiKey,
  keys.vapidPrivateApiKey
);

exports.WebPushNotifications = {
  sendRequestAwaitingRequesterConfirmCompletionText: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `${requestTitle} awaiting your confirmation!`,
          },
          contents: {
            en: 'Tasker is done! Click for more details',
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} awaiting your confirmation!`,
          body: `Tasker is done! Click for more details`,
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
      bugsnagClient.notify(e);

      return e;
    }
  },

  pushAwardedRequestWasCancelled: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `${requestTitle} was cancelled!`,
          },
          contents: {
            en: 'It is cancelled! Click for more details',
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} was cancelled!`,
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  pushNewBidRecieved: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `Request Recieved New Bid!`,
          },
          contents: {
            en: `${requestTitle} Recieved New Bid! Click for more details`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Request Recieved New Bid!`,
          body: `${requestTitle} Recieved New Bid! Click for more details`,
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
      bugsnagClient.notify(e);

      console.log('BIDORBOO_ERROR: WEBPUSH ISSUE ' + JSON.stringify(e));
      return e;
    }
  },

  pushNewRequestInYourArea: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `NEW ${requestTitle} request in your area!`,
          },
          contents: {
            en: `Act fast, be the first to bid`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  pushAwardedRequestWasCompleted: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `${requestTitle} is completed!`,
          },
          contents: {
            en: `It is DONE! Click to Review it`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `${requestTitle} is completed!`,
          body: `It is DONE! Click to Review it`,
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  tellRequesterThatWeMarkedRequestDone: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `Request is completed, Rate Tasker`,
          },
          contents: {
            en: `BidOrBoo marked ${requestTitle} as Complete because you did not act in 3 days.`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Request is completed, Rate Tasker`,
          body: `BidOrBoo marked ${requestTitle} as Complete because you did not act in 3 days.`,
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  tellRequesterToConfirmRequest: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `Confirm that ${requestTitle} is Completed!`,
          },
          contents: {
            en: `Click to confirm completion and Review the tasker`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Confirm that ${requestTitle} is Completed!`,
          body: `Click to confirm completion and Review the tasker`,
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  pushRequestIsHappeningSoon: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { requestTitle, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `${requestTitle} is Happening Soon!`,
          },
          contents: {
            en: `It is happening soon! Click for more details`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  pushYouAreAwarded: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { taskerDisplayName, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `Good News ${taskerDisplayName}`,
          },
          contents: {
            en: `Your Bid WON! click for details`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
      if (targetUserPushSubscription) {
        const payload = JSON.stringify({
          title: `Good News ${taskerDisplayName}`,
          body: `Your Bid WON! click for details`,
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
      bugsnagClient.notify(e);

      return e;
    }
  },
  sendPush: async (
    targetUserPushSubscription = '',
    oneSignalId = '',
    { title, body, icon, urlToLaunch }
  ) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return;
    // }
    try {
      if (oneSignalId) {
        const notification = {
          app_id: keys.onesignalPublicKey,
          headings: {
            en: `Good News ${taskerDisplayName}`,
          },
          contents: {
            en: `Your Bid WON! click for details`,
          },
          url: urlToLaunch,
          include_player_ids: [oneSignalId],
        };

        OneSignalClient.createNotification(notification)
          .then((response) => {
            console.log(response.body.id);
          })
          .catch((e) => {
            if (e instanceof OneSignal.HTTPError) {
              // When status code of HTTP response is not 2xx, HTTPError is thrown.
              console.log('ONESIGNAL ERROR START');
              console.log(e.statusCode);
              console.log(e.body);
              console.log('ONESIGNAL ERROR END');
            }
          });
      }
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
      bugsnagClient.notify(e);

      return e;
    }
  },
};
