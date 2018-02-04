const passport = require('passport');
module.exports = app => {
  app.get('/', (req, res) => {
    res.send({
      hi: 'hey there'
    });
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
    (req, res) =>{
      res.redirect('/')
    }
    );

  //Facebook routes
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { session: false })
  );
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false })
  );

  // shared
  app.get('/api/current_user', (req, res) => {
   // console.log('req', req);
   // console.log('resreq', res);
    res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

};
