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




  //---------------ANDROIND SPECIFIC----------------
  app.post('/mobile/googleauth/loginOrRegister', async (req, res) => {
    debugger;
    const profile = {};
    try {
      const existingUser = await userDataAccess.findOneByUserId(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      }

      const userDetails = {
        userId: profile.id,
        email: profile.emails ? profile.emails[0].value : '',
        profileImgUrl: profile.photos
          ? profile.photos[0].value
          : 'https://goo.gl/92gqPL'
      };

      const user = await userDataAccess.createNewUser(userDetails);
      // done(null, user);
    } catch (err) {
      // done(err, null);
    }
  })
};
