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
      // done(null, user);
      res.send(existingUser);

    } catch (err) {
      res.send(err);
      done(err, null);
    }
  })
};
