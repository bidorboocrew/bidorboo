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
    async (req, res, next) => {
      //TO DO check for errors probably and redirect to the same place you came form instead
      const {email, password} = req.body;
      try {

        if(!email || !password){
          return done(null, null);
        }

        // const existingUser = await userDataAccess.findOneByemail(email);
        // if (existingUser) {
        //   res.send({msg: "user already Exists"}, null);
        //   return done(null, existingUser);
        // }

        const userDetails = {
          userId: email,
          email: email,
          profileImgUrl: 'https://goo.gl/92gqPL'
        };

        // const user = await userDataAccess.createNewUser(userDetails);
        res.send('/bidder')
        // res.send(null, user);
        // done(null, user);
      } catch (err) {
        res.send(err, null);
        done(err, null);
      }

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
