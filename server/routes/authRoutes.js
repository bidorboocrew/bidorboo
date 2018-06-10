const passport = require('passport');
const ROUTES = require('../backend_route_constants');

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
    passport.authenticate('google', {
      successReturnToOrRedirect: ROUTES.FRONTEND.HOME,
      failureRedirect: '/errorRoute',
      failureFlash: true
    })
  );

  // Facebook routes
  app.get(
    ROUTES.AUTH.FACEBOOK,
    passport.authenticate('facebook', { failureRedirect: '/errorRoute' })
  );
  app.get(
    ROUTES.AUTH.FACEBOOK_CALLBACK,
    passport.authenticate('facebook', {
      successReturnToOrRedirect: ROUTES.FRONTEND.HOME,
      failureRedirect: '/errorRoute',
      failureFlash: true
    })
  );

  app.get(ROUTES.AUTH.LOGOUT, (req, res) => {
    req.logout();
    req.session = null
    res.send({success: "logout successfully"});
  });
};
