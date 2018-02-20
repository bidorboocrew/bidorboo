const passport = require('passport');
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const userDataAccess = require('../data-access/userDataAccess');

const ROUTES = require('../route_constants');



module.exports = app => {
  app.get(ROUTES.USERAPI.GET_CURRENTUSER, (req, res) => {
    res.send(req.user);
  });


  app.post(
    ROUTES.USERAPI.REGISTER,
    passport.authenticate('local'),
    (req, res) => {
      //TO DO check for errors probably and redirect to the same place you came form instead
      res.redirect('/');
    }
  );


  app.post(
    ROUTES.USERAPI.REGISTER,
    async (req, res) => {
      //TO DO check for errors probably and redirect to the same place you came form instead
      const {username, password} = req.body;
      try {

        if(!usrname || !password){
          return done(null, null);
        }

        const existingUser = await userDataAccess.findOneByemail(username);
        if (existingUser) {
          return done(null, existingUser);
        }

        const userDetails = {
          userId: profile.username,
          email: username,
          profileImgUrl: 'https://goo.gl/92gqPL'
        };

        const user = await userDataAccess.createNewUser(userDetails);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
      res.redirect(ROUTES.USERAPI.LOGIN);
    }
  );

  app.post(
    ROUTES.USERAPI.LOGIN,
    passport.authenticate('local'),
    (req, res) => {
      //TO DO check for errors probably and redirect to the same place you came form instead
      res.redirect('/');
    }
  );


  //---------------ANDROIND SPECIFIC----------------
  app.post('/mobile/googleauth/loginOrRegister', jsonParser, async (req, res, done) => {
    const {profile} = req.body;
    try {
      const existingUser = await userDataAccess.findOneByUserId(profile.id);
      if (existingUser) {
        res.send(existingUser);
        return done(null, existingUser);
      }

      const userDetails = {
        userId: profile.id,
        email: profile.email,
        profileImgUrl: profile.photo? profile.photo : 'https://goo.gl/92gqPL'
      };

      const user = await userDataAccess.createNewUser(userDetails);
      res.send(existingUser);
      done(null, user);

    } catch (err) {
      res.send(err);
      done(err, null);
    }
  })
  //---------------ANDROIND SPECIFIC----------------
};
