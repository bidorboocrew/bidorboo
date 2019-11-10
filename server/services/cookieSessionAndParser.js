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
  const expiryDate = 10 * 24 * 60 * 60 * 1000; //10 days
  app.use(
    cookieSession({
      secureProxy: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production',
      domain: '/',
      maxAge: expiryDate, // 24 hours
      keys: [keys.cookieKey, keys.cookieKey2],
      expires: new Date(Date.now() + expiryDate),
    })
  );
  app.use(cookieParser());
};
