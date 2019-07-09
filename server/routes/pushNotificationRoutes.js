const ROUTES = require('../backend-route-constants');

const webpush = require('web-push');
const keys = require('../config/keys');
const userDataAccess = require('../data-access/userDataAccess');
module.exports = (app) => {
  let subscription;
  let pushIntervalID;

  webpush.setVapidDetails(
    'mailto:bidorboocrew@bidorboo.com',
    keys.vapidPublicApiKey,
    keys.vapidPrivateApiKey
  );

  app.post(ROUTES.API.PUSH.POST.pushNotification, async (req, res) => {
    try {
      subscription = JSON.parse(req.body.data);
      const data = {
        title: req.body.payLoad.initialDetails.fromTemplateIdField,
        body: "It's a success!",
        icon:
          'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1545981752/BidOrBoo/android-chrome-192x192.png',
      };

      // const payLoad = JSON.stringify({ notificationDetails: 'what do you want to send to user' });
      const payLoad = JSON.stringify(data);
      await webpush.sendNotification(subscription, payLoad);
      res.status(201).json({});
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To send notification', details: `${e}` });
    }
  });

  app.delete(ROUTES.API.PUSH.DELETE.unregisterPushNotification, (req, res, next) => {
    subscription = null;
    clearInterval(pushIntervalID);
    res.sendStatus(200);
  });
  app.post(ROUTES.API.PUSH.POST.registerPushNotification, async (req, res, next) => {
    try {
      // user is not logged in . do not bother
      if (!req.user || !req.user.userId || !req.user._id) {
        return res.status(201).json({});
      }
      const data = req.body.data;
      const { subscription } = data;

      const currentUser = await userDataAccess.findOneByUserId(req.user.userId);
      const noPushWasSentBefore = !!currentUser.pushSubscription;
      if (!noPushWasSentBefore) {
        const payload = JSON.stringify({
          title: 'BidOrBoo Push Enabled.',
          body: ' Welcome to BidOrBoo , You Can Control Notification settings in your profile',
          icon:
            'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1545981752/BidOrBoo/android-chrome-192x192.png',
          urlToLaunch: 'https://www.bidorboo.com/my-profile/basic-settings',
        });
        await webpush.sendNotification(JSON.parse(subscription), payload);
      }
      await userDataAccess.findByUserIdAndUpdate(req.user.userId, {
        pushSubscription: subscription,
      });
      return res.status(201).json({ success: true });
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To register push notifications', details: `${e}` });
    }
  });
};
