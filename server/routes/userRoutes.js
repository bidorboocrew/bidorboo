const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const utils = require('../utils/utilities');

module.exports = app => {
  //get current user
  app.get(ROUTES.API.USER.GET.currentUser, async (req, res, done) => {
    try {
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findOneByUserId(req.user.userId);
        if (existingUser) {
          return res.send(existingUser);
        }
      }
      done(null, null);
    } catch (e) {
      return res
        .status(500)
        .send({ error: 'Sorry Something went wrong \n' + e });
    }
  });

  app.put(ROUTES.API.USER.PUT.userDetails, requireLogin, async (req, res) => {
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
      return res
        .status(500)
        .send({ error: 'Sorry Something went wrong \n' + e });
    }
  });

  app.put(
    ROUTES.API.USER.PUT.profilePicture,
    requireLogin,
    async (req, res) => {
      try {
        const filesList = req.files;
        // create new job for this user
        const data = req.body.data;
        const userId = req.user.userId;
        const userMongoDBId = req.user._id;

        const callbackFunc = async (error, result) => {
          // update the user data model
          try {
            if (!error) {
              await userDataAccess.findOneByUserIdAndUpdateProfileInfo(userId, {
                profileImage: { url: result.secure_url, public_id: result.public_id }
              });
            }
            return res.send({
              error: error,
              result: result ? result.url : {}
            });
          } catch (e) {
            res
              .status(500)
              .send({ error: 'Sorry Something went wrong \n' + e });
          }
        };

        let newProfileImgDetails = await utils.uploadFileToCloudinary(
          filesList[0].path,
          callbackFunc
        );
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );
};
