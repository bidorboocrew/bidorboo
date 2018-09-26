const passport = require('passport');
const ROUTES = require('../backend-route-constants');

module.exports = app => {
  //google routes
  app.get(
    ROUTES.API.AUTH.GOOGLE,
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  app.get(
    ROUTES.API.AUTH.GOOGLE_CALLBACK,
    passport.authenticate('google', {
      successReturnToOrRedirect: ROUTES.CLIENT.HOME,
      failureRedirect: '/errorRoute',
      failureFlash: true
    })
  );

  // Facebook routes
  app.get(
    ROUTES.API.AUTH.FACEBOOK,
    passport.authenticate('facebook', { failureRedirect: '/errorRoute' })
  );
  app.get(
    ROUTES.API.AUTH.FACEBOOK_CALLBACK,
    passport.authenticate('facebook', {
      successReturnToOrRedirect: ROUTES.CLIENT.HOME,
      failureRedirect: '/errorRoute',
      failureFlash: true
    })
  );

  app.get(ROUTES.API.AUTH.LOGOUT, (req, res) => {
    req.logout();
    req.session = null
    res.send({success: "logout successfully"});
  });
};
