const passport = require('passport');
const bodyParser = require('body-parser');
// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('../route_constants');
const requireLogin = require('../middleware/requireLogin');

module.exports = app => {
  //get current user
  app.get(ROUTES.USERAPI.GET_CURRENTUSER, (req, res) => {
    res.send(req.user);
  });
  app.put(
    ROUTES.USERAPI.PUT_UPDATE_PROFILE_DETAILS,
    requireLogin,
    async (req, res) => {
      try {
        const newProfileDetails = req.body.data;
        const userId = req.user.userId;
        const options = { new: true };
        Object.keys(newProfileDetails).forEach(property => {
          newProfileDetails[`${property}`] =
          newProfileDetails[`${property}`].trim();
        });
        const callback = (err, userAfterUpdates) => {
          if (err) {
            res.send(err);
            return done(err, null);
          }
          res.send(userAfterUpdates);
        };

        const userAfterUpdates = await userDataAccess.findOneByUserIdAndUpdate(
          userId,
          newProfileDetails,
          options,
          callback
        );
      } catch (err) {
        res.send(err);
        return done(err, null);
      }
    }
  );

  //---------------ANDROIND SPECIFIC----------------
  app.post(
    '/mobile/googleauth/loginOrRegister',
    jsonParser,
    async (req, res, done) => {
      const { profile } = req.body;
      try {
        const existingUser = await userDataAccess.findOneByUserId(profile.id);
        if (existingUser) {
          res.send(existingUser);
          return done(null, existingUser);
        }

        const userDetails = {
          userId: profile.id,
          email: profile.email,
          profileImgUrl: profile.photo ? profile.photo : 'https://goo.gl/92gqPL'
        };

        const user = await userDataAccess.createNewUser(userDetails);
        res.send(existingUser);
        return done(null, user);
      } catch (err) {
        res.send(err);
        return done(err, null);
      }
    }
  );
  //---------------ANDROIND SPECIFIC----------------
};
