const passport = require('passport');
const ROUTES = require('../route_constants');
const keys = require('../config/keys');

//ANDROID only
const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;
const client = new auth.OAuth2(keys.googleClientID, '', '');

//ANDROID only


module.exports = app => {
app.get('/auth/verifyuser'),
  (req, res) => {

    client.verifyIdToken(
      token,
      CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      (e, login) => {
        var payload = login.getPayload();
        var userid = payload['sub'];
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
      });
    return user
  }
}

  // google routes
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

  //-----------------------------------------------




};
