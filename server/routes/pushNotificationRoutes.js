const ROUTES = require('../backend-route-constants');
const utils = require('../utils/utilities');
const webpush = require('web-push');
const express = require('express');
const path = require('path');

const app = express();
app.use(require('body-parser').json());

const PUBLIC_VAPID_KEY =
  'BNNIelsxMdODKuerQ6A28c0ASnc0YP7BygBjuTkR0qRgRSJXOonCx5Juk2VZgOLmiAbTl04zER-AbdRScMOzYfE';
const PRIVATE_VAPID_KEY = 'mBs1Vn_RlkKliJjiOY8bZNAiifIj1HKOM3EHra-175M';

module.exports = (app) => {
  //// for testing only, will add this in db later///
  const testData = {
    title: 'Testing',
    body: "It's a success!",
    icon: '/path/to/an/icon.png',
  };

  let subscription;
  let pushIntervalID;

  webpush.setVapidDetails('mailto:bidorboocrew@gmail.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

  // app.post('/api/pushNotification', async (req, res) => {
  //   subscription = JSON.parse(req.body.data);

  //   res.status(201).json({});

  //   //console.log('subscription', subscription);
  //   const payLoad = JSON.stringify(testData);
  //   // const notificationReq = await webpush
  //   //   .sendNotification(subscription, payLoad)
  //   //   .catch((err) => console.error(err.stack));
  //   //res.sendStatus(201);
  //   pushIntervalID = setInterval(() => {
  //     // sendNotification can only take a string as it's second parameter
  //     webpush
  //       .sendNotification(subscription, JSON.stringify(testData))
  //       .catch(() => clearInterval(pushIntervalID));
  //   }, 30000);
  // });


  app.post('/api/pushNotification', async (req, res) => {
    try {
      subscription = JSON.parse(req.body.data);

      res.status(201).json({});

      // const payLoad = JSON.stringify({ notificationDetails: 'what do you want to send to user' });

      const payLoad = JSON.stringify(testData);
      const notificationReq = await webpush.sendNotification(subscription, payLoad);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To send notification', details: e });
    }
  });

  app.delete('/api/unregister', (req, res, next) => {
    subscription = null;
    clearInterval(pushIntervalID);
    res.sendStatus(200);
  });
};
