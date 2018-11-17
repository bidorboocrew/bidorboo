const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const keys = require('../config/keys');

module.exports = app => {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  //https://github.com/expressjs/cookie-session
  const expiryDate = 10 * 24 * 60 * 60 * 1000; //10 days
  app.use(
    cookieSession({
      maxAge: expiryDate, // 24 hours
      keys: [keys.cookieKey, keys.cookieKey2],
      cookie: {
        secure: true,
        httpOnly: true,
        domain: 'bidorboo.com',
        expires: new Date(Date.now() + expiryDate)
      }
    })
  );
  app.use(cookieParser());
};
