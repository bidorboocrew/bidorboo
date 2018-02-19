const passport = require('passport');

const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('../route_constants');

module.exports = app => {
  app.get(ROUTES.USERAPI.GET_CURRENTUSER, (req, res) => {
    res.send(req.user);
  });

  app.post('/user/register', (req, res) => {
    console.log('registering user');
    //check if user exists

    //if user doesnt exist create user schema and add to DB
    //set the id for the user programatically to be their email
  });
  app.post(
    ROUTES.USERAPI.LOGIN,
    passport.authenticate('local'),
    (req, res) => {
      //TO DO check for errors probably and redirect to the same place you came form instead
      res.redirect('/');
    }
  );
};
