const passport = require('passport');
const ROUTES = require('../backend-route-constants');
const requirePassesRecaptcha = require('../middleware/requirePassesRecaptcha');

const CLIENT_URL_BASE =
  process.env.NODE_ENV === 'production' ? 'https://www.bidorboo.ca/' : 'localhost:3000/';
module.exports = (app) => {
  //google routes
  app.get(
    ROUTES.API.AUTH.GOOGLE,
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get(
    ROUTES.API.AUTH.GOOGLE_CALLBACK,
    passport.authenticate('google', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/?loginSuccess=false',
      failureFlash: true,
    }),
    (req, res) => {
      res.redirect('/?loginSuccess=true');
    }
  );

  // Facebook routes
  app.get(
    ROUTES.API.AUTH.FACEBOOK,
    passport.authenticate('facebook', {
      scope: ['email'],
    })
  );
  app.get(
    ROUTES.API.AUTH.FACEBOOK_CALLBACK,
    passport.authenticate('facebook', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/?loginSuccess=false',
      failureFlash: true,
    }),
    (req, res) => {
      res.redirect('/?loginSuccess=true');
    }
  );

  app.get(ROUTES.API.AUTH.LOGOUT, (req, res, next) => {
    req.logout(() => (req.session = null));

    res.send({ success: 'logout successfully' });
  });

  app.post(
    ROUTES.API.AUTH.REGISTER_NEW_USER,
    requirePassesRecaptcha,
    async (req, res, next) => {
      return passport.authenticate('local-register', (err, user, info) => {
        if (err) {
          return res.status(400).send({
            errorMsg: err.message ? err.message : 'Failed To Register user',
            details: err,
          });
        }
        if (!user) {
          return res
            .status(400)
            .send({ errorMsg: "Failed To Register user, couldn't create user" });
        }

        // https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          return next(null, user);
        });
      })(req, res, next);
    },
    (req, res, next) => {
      const redirectUrl = '/';

      return res.send({ user: req.user, redirectUrl });
    }
  );

  app.post(
    ROUTES.API.AUTH.LOCAL_LOGIN,
    requirePassesRecaptcha,
    async (req, res, next) => {
      passport.authenticate('local-login', (err, user, info) => {
        if (err) {
          return res.status(401).send({ errorMsg: 'Failed To login', details: err });
        }
        if (!user) {
          return res.status(401).send({ success: false, message: 'authentication failed' });
        }

        // https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          return next(null, user);
        });
      })(req, res, next);
    },
    async (req, res, done) => {
      const redirectUrl = '/';
      return res.send({ user: req.user, redirectUrl });
    }
  );
};
