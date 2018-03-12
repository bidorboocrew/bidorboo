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
  app.get(ROUTES.USERAPI.GET_CURRENTUSER, async (req, res, done) => {
    try {
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findOneByUserId(req.user.userId);
        if (existingUser) {
          res.send(existingUser);
        }
      }
      done(null, existingUser);
    } catch (err) {
      res.send(err);
      done(err, null);
    }
  });

  app.put(
    ROUTES.USERAPI.PUT_UPDATE_PROFILE_DETAILS,
    requireLogin,
    async (req, res, done) => {
      try {
        const newProfileDetails = req.body.data;
        const userId = req.user.userId;
        const options = {
          new: true
        };
        Object.keys(newProfileDetails).forEach(property => {
          newProfileDetails[`${property}`] = newProfileDetails[
            `${property}`
          ].trim();
        });

        const userAfterUpdates = await userDataAccess.findOneByUserIdAndUpdateProfileInfo(
          userId,
          newProfileDetails,
          options
        );
        res.send(userAfterUpdates);
        done(null, userAfterUpdates);
      } catch (err) {
        res.send(err);
        done(err, null);
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
          done(null, existingUser);
        }

        const userDetails = {
          userId: profile.id,
          email: profile.email,
          profileImgUrl: profile.photo ? profile.photo : 'https://goo.gl/92gqPL'
        };

        const user = await userDataAccess.createNewUser(userDetails);
        res.send(existingUser);
        done(null, user);
      } catch (err) {
        res.send(err);
        done(err, null);
      }
    }
  );
  //---------------ANDROIND SPECIFIC----------------
};
