const passport = require('passport');
module.exports = app => {
  app.get('/', (req, res) => {

  });

  //google routes
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {

      res.redirect('/api/curent_user');
      res.redirect
    }
  );

  //Facebook routes
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook')
  );
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook'),
    (req, res) => {
      res.redirect('/');
    }
  );

  // shared
  app.get('/api/current_user', (req, res) => {
    // console.log('req', req);
    // console.log('resreq', res);
    console.log(req.user);
    res.send(JSON.stringify(req.user));
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
};
