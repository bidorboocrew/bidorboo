const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('req-flash');
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
  const expiryDate = 100 * 24 * 60 * 60 * 1000; //10 days

  app.use(
    cookieSession({
      name: 'session',
      keys: [keys.cookieKey, keys.cookieKey2],
      sameSite: 'strict',
      maxAge: expiryDate,
      cookie: {
        secure: true,
        httpOnly: true,
        domain: 'bidorboo.ca',
        path: '/',
      },
    })
  );
  app.use(cookieParser());
  app.use(flash());
};
