const passport = require('passport');
const ROUTES = require('./route_constants');

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
      res.redirect(ROUTES.ENTRY);
    }
  );

  //Facebook routes
  // app.get(ROUTES.AUTH.FACEBOOK, passport.authenticate('facebook'));
  // app.get(
  //   ROUTES.AUTH.FACEBOOK_CALLBACK,
  //   passport.authenticate('facebook'),
  //   (req, res) => {
  //     res.redirect(ROUTES.ENTRY);
  //   }
  // );

  app.get(ROUTES.USERAPI.LOGOUT, (req, res) => {
    req.logout();
    res.redirect(ROUTES.ENTRY);
  });
};
