const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const keys = require('../config/keys');

const isWebHookCall = (req) => req.url.indexOf('stripewebhook') > -1;

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use((req, res, next) => {
    if (isWebHookCall(req)) {
      bodyParser.raw({ type: '*/*' })(req, res, next);
    } else {
      bodyParser.json()(req, res, next);
    }
  });

  //https://github.com/expressjs/cookie-session
  const expiryDate = 30 * 24 * 60 * 60 * 1000; //10 days

  app.use(
    cookieSession({
      sameSite: 'strict',
      maxAge: expiryDate,
      keys: [keys.cookieKey, keys.cookieKey2],
    })
  );
  app.use(cookieParser());
};
