const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('../backend_route_constants');
const requireLogin = require('../middleware/requireLogin');

module.exports = app => {
  //get current user
  app.get(ROUTES.USERAPI.GET_CURRENTUSER, async (req, res, done) => {
    try {
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findOneByUserId(req.user.userId);
        if (existingUser) {
          return res.send(existingUser);
        }
      }
      done(null, existingUser);
    } catch (e) {
      return res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
    }
  });

  app.put(
    ROUTES.USERAPI.PUT_UPDATE_PROFILE_DETAILS,
    requireLogin,
    async (req, res) => {
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
        return res.send(userAfterUpdates);
      } catch (e) {
        return res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

};
