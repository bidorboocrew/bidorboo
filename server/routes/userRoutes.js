const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const utils = require('../utils/utilities');

module.exports = (app) => {
  app.get(ROUTES.API.USER.GET.currentUser, async (req, res) => {
    try {
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findOneByUserId(req.user.userId);
        if (existingUser) {
          return res.send(existingUser);
        }
      }
      return res.send({});
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get current user', details: e });
    }
  });

  app.put(ROUTES.API.USER.PUT.userDetails, requireLogin, async (req, res) => {
    try {
      const newProfileDetails = req.body.data;
      const userId = req.user.userId;

      // cycle through the properties provided { name: blablabla, telephoneNumber : 123123123...etc}
      Object.keys(newProfileDetails).forEach((property) => {
        newProfileDetails[`${property}`] = newProfileDetails[`${property}`].trim();
      });

      const userAfterUpdates = await userDataAccess.updateUserProfileDetails(
        userId,
        newProfileDetails
      );
      return res.send(userAfterUpdates);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To update user details', details: e });
    }
  });

  app.put(ROUTES.API.USER.PUT.profilePicture, requireLogin, async (req, res) => {
    try {
      const filesList = req.files;
      const userId = req.user.userId;
      const callbackFunc = async (error, result) => {
        // update the user data model
        try {
          if (!error) {
            const userWithNewProfileImg = await userDataAccess.updateUserProfilePic(
              userId,
              result.secure_url,
              result.public_id
            );
            return res.send(userWithNewProfileImg);
          }
          return res.status(500).send({ errorMsg: 'Failed To upload profile img', details: e });
        } catch (e) {
          return res.status(500).send({ errorMsg: 'Failed To upload to cloudinary', details: e });
        }
      };

      await utils.uploadFileToCloudinary(filesList[0].path, callbackFunc);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To upload profile img', details: e });
    }
  });
};
