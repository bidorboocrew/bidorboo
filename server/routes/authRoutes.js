const passport = require('passport');
const ROUTES = require('../backend-route-constants');

module.exports = (app) => {
  //google routes
  app.get(ROUTES.API.AUTH.GOOGLE, (req, res, next) => {
    let sourcePage = `${req.query.originPath || '/'}`;
    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: JSON.stringify({ sourcePage: sourcePage }),
    })(req, res, next);
  });
  app.get(ROUTES.API.AUTH.GOOGLE_CALLBACK, (req, res, next) => {
    let sourcePage = '/';
    if (req.query.state) {
      const getRedirectPathFromState = JSON.parse(req.query.state);
      if (getRedirectPathFromState.sourcePage) {
        sourcePage = getRedirectPathFromState.sourcePage;
      }
    }

    return passport.authenticate('google', {
      successReturnToOrRedirect: sourcePage,
      failureRedirect: '/errorRoute',
      failureFlash: true,
    })(req, res, next);
  });

  // Facebook routes
  app.get(ROUTES.API.AUTH.FACEBOOK, (req, res, next) => {
    let sourcePage = `${req.query.originPath || '/'}`;
    return passport.authenticate('facebook', {
      scope: ['email'],
      state: JSON.stringify({ sourcePage: sourcePage }),
    })(req, res, next);
  });
  app.get(ROUTES.API.AUTH.FACEBOOK_CALLBACK, (req, res, next) => {
    let sourcePage = '/';
    if (req.query.state) {
      const getRedirectPathFromState = JSON.parse(req.query.state);
      if (getRedirectPathFromState.sourcePage) {
        sourcePage = getRedirectPathFromState.sourcePage;
      }
    }

    return passport.authenticate('facebook', {
      successReturnToOrRedirect: sourcePage,
      failureRedirect: '/errorRoute',
      failureFlash: true,
    })(req, res, next);
  });

  app.get(ROUTES.API.AUTH.LOGOUT, (req, res) => {
    req.logout();
    req.session = null;
    res.send({ success: 'logout successfully' });
  });
};
