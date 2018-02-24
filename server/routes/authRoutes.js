const passport = require('passport');
const ROUTES = require('../route_constants');

module.exports = app => {
  //google routes
  app.get(
    ROUTES.AUTH.GOOGLE,
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  app.get(
    ROUTES.AUTH.GOOGLE_CALLBACK,
    passport.authenticate('google', { failureRedirect: '/errorRoute' }),
    (req, res) => {
      res.redirect(ROUTES.FRONTEND.HOME);
    }
  );

  app.post(ROUTES.AUTH.REGISTER, (req, res, next) => {
    passport.authenticate('local-register', (err, user, info) => {
      if (err) {
        return res.send({
          errorMsg: info || `Couldn't run the registration`,
          errorDetails: err
        });
      } else if (!user) {
        if (info) {
          return res.send({
            errorMsg: `Sorry! We couldn't register you.`,
            errorDetails: info
          });
        }
        return res.send({
          errorMsg: `Sorry! We couldn't register you.`,
          errorDetails: 'we encountered an issue while registering your user'
        });
      }
      return res.send(user);
    })(req, res, next)
  });

  app.post(ROUTES.AUTH.LOGIN, (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) {
        return res.send({
          errorMsg: info || `Couldn't login at this time`,
          errorDetails: err
        });
      } else if (!user) {
        if (info) {
          return res.send({
            errorMsg: `Sorry! We couldn't log you in.`,
            errorDetails: info
          });
        }
        return res.send({
          errorMsg: `Sorry! We couldn't log you in.`,
          errorDetails: 'we encountered an issue while logging your user'
        });
      }
      return res.send(user);
    })(req, res, next)
  });
  //Facebook routes
  // app.get(ROUTES.AUTH.FACEBOOK, passport.authenticate('facebook'));
  // app.get(
  //   ROUTES.AUTH.FACEBOOK_CALLBACK,
  //   passport.authenticate('facebook'),
  //   (req, res) => {
  //     res.redirect(ROUTES.ENTRY);
  //   }
  // );

  app.get(ROUTES.AUTH.LOGOUT, (req, res) => {
    req.logout();
    res.redirect(ROUTES.ENTRY);
  });
};
