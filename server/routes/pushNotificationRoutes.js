const webpush = require('web-push');
const keys = require('../config/keys');
const userDataAccess = require('../data-access/userDataAccess');
module.exports = (app) => {
  let subscription;
  let pushIntervalID;

  webpush.setVapidDetails(
    'mailto:bidorboocrew@gmail.com',
    keys.vapidPublicApiKey,
    keys.vapidPrivateApiKey
  );

  app.post('/api/pushNotification', async (req, res) => {
    try {
      subscription = JSON.parse(req.body.data);
      const data = {
        title: req.body.payLoad.initialDetails.fromTemplateIdField,
        body: "It's a success!",
        icon: 'https://image.flaticon.com/icons/svg/753/753078.svg',
      };

      // const payLoad = JSON.stringify({ notificationDetails: 'what do you want to send to user' });
      const payLoad = JSON.stringify(data);
      await webpush.sendNotification(subscription, payLoad);
      res.status(201).json({});
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To send notification', details: `${e}` });
    }
  });

  app.delete('/api/push/unregister', (req, res, next) => {
    subscription = null;
    clearInterval(pushIntervalID);
    res.sendStatus(200);
  });
  app.post('/api/push/register', async (req, res, next) => {
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
          title: 'BidOrBoo Notifications enabled.',
          body: ' Control Notification settings in your profile',
          icon: 'https://image.flaticon.com/icons/svg/753/753078.svg',
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
        .status(500)
        .send({ errorMsg: 'Failed To register push notifications', details: `${e}` });
    }
  });
};
