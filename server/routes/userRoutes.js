const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const utils = require('../utils/utilities');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requireUserHasNoStripeAccount = require('../middleware/requireUserHasNoStripeAccount');

const cloudinary = require('cloudinary');
const stripeServiceUtil = require('../services/stripeService').util;

module.exports = (app) => {
  app.post(
    ROUTES.API.USER.POST.verifyEmail,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const userId = req.user.userId;
        const user = await userDataAccess.findOneByUserId(userId);
        if (user && user.email && req.body.data.code) {
          const { code } = req.body.data;

          const emailVerification = user.verification.email;
          const emailCorrespondingToTheCode = emailVerification && emailVerification[`${code}`];
          if (user.email.emailAddress === emailCorrespondingToTheCode) {
            const newUser = await userDataAccess.updateUserProfileDetails(userId, {
              email: { ...user.email, isVerified: true },
            });
            return res.send({ success: true });
          } else {
            return res.send({ success: false });
          }
        } else {
          return res.status(403).send({
            errorMsg: 'verifyEmail failed due to missing params',
          });
        }
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To verifyEmail', details: e });
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.verifyPhone,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const userId = req.user.userId;
        const user = await userDataAccess.findOneByUserId(userId);
        if (user && user.phone && req.body.data.code) {
          const { code } = req.body.data;

          const phoneVerification = user.verification.phone;
          const phoneNumberCorrespondingToTheCode =
            phoneVerification && phoneVerification[`${code}`];
          if (user.phone.phoneNumber === phoneNumberCorrespondingToTheCode) {
            const newUser = await userDataAccess.updateUserProfileDetails(userId, {
              phone: { ...user.phone, isVerified: true },
            });
            return res.send({ success: true });
          } else {
            return res.send({ success: false });
          }
        } else {
          return res.status(403).send({
            errorMsg: 'verifyPhone failed due to missing params',
          });
        }
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To verifyPhone', details: e });
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.sendVerificationEmail,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const user = await userDataAccess.findOneByUserId(req.user.userId);
        if (user) {
        } else {
          return res.status(403).send({
            errorMsg: 'verifyEmail failed due to missing params',
          });
        }
        return res.send({ success: true });
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To sendVerificationEmail', details: e });
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.sendVerificationMsg,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const user = await userDataAccess.findOneByUserId(req.user.userId);
        if (user && user.phone.phoneNumber) {
        } else {
          return res.status(403).send({
            errorMsg: 'verifyEmail failed due to missing params',
          });
        }
        return res.send({ success: true });
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To sendVerificationMsg', details: e });
      }
    }
  );

  app.get(ROUTES.API.USER.GET.currentUser, requireBidorBooHost, async (req, res) => {
    try {
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findUserAndAllNewNotifications(req.user.userId);
        if (existingUser) {
          return res.send(existingUser);
        }
      }
      return res.send({});
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get current user', details: e });
    }
  });

  app.put(ROUTES.API.USER.PUT.userDetails, requireBidorBooHost, requireLogin, async (req, res) => {
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

  app.put(
    ROUTES.API.USER.PUT.setupPaymentDetails,
    requireBidorBooHost,
    requireLogin,
    requireUserHasNoStripeAccount,
    async (req, res) => {
      try {
        const userId = req.user.userId;

        const reqData = req.body.data;
        const { connectedAccountDetails, metaData } = reqData;

        const connectedAccount = await stripeServiceUtil.createConnectedAccount(
          connectedAccountDetails,
          {
            ...metaData,
          }
        );
        const updatedUser = await userDataAccess.updateUserProfileDetails(userId, {
          agreedToServiceTerms: true,
          membershipStatus: 'VERIFIED_MEMBER',
          stripeConnect: {
            accId: connectedAccount.id,
            ownerId: connectedAccount.metadata._id,
          },
        });
        return res.send({ success: true, updatedUser: updatedUser });
      } catch (e) {
        return res.status(500).send({ errorMsg: e });
      }
    }
  );

  app.put(ROUTES.API.USER.PUT.profilePicture, requireLogin, async (req, res) => {
    try {
      if (req.files && req.files.length === 1) {
        const filesList = req.files;
        const userId = req.user.userId;
        const userMongoDBId = req.user._id;

        const updateUserWithNewProfileImg = async (error, result) => {
          try {
            if (!error) {
              const userWithNewProfileImg = await userDataAccess.updateUserProfilePic(
                userId,
                result.secure_url,
                result.public_id
              );
              return res.send(userWithNewProfileImg);
            }
          } catch (e) {
            return res.status(500).send({ errorMsg: 'Failed To upload to cloudinary', details: e });
          }
        };

        // delete old profile images if it exist (to save space)
        const currentUser = await userDataAccess.findUserImgDetails(userId);

        if (currentUser && currentUser.profileImage && currentUser.profileImage.public_id) {
          await cloudinary.v2.uploader.destroy(
            currentUser.profileImage.public_id,
            (error, result) => {
              // we dont care about errors here as we pretty much either delete the image or .. it gets stale
              console.log(result, error);
            }
          );
        }

        const newImg = await utils.uploadFileToCloudinary(
          filesList[0].path,
          {
            folder: `${userMongoDBId}/`,
          },
          updateUserWithNewProfileImg
        );
      } else {
        return res.status(403).send({
          errorMsg: 'image upload failed due to missing params',
        });
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To upload profile img', details: e });
    }
  });
};

// The old way of putting the image where I use file upload onto the server
//  app.put(
//   ROUTES.API.USER.PUT.profilePicture,
//   requireBidorBooHost,
//   requireLogin,
//   async (req, res) => {
//     try {
//       const filesList = req.files;
//       const userId = req.user.userId;
//       const callbackFunc = async (error, result) => {
//         // update the user data model
//         try {
//           if (!error) {
//             const userWithNewProfileImg = await userDataAccess.updateUserProfilePic(
//               userId,
//               result.secure_url,
//               result.public_id
//             );
//             return res.send(userWithNewProfileImg);
//           }
//           return res.status(500).send({ errorMsg: 'Failed To upload profile img', details: e });
//         } catch (e) {
//           return res.status(500).send({ errorMsg: 'Failed To upload to cloudinary', details: e });
//         }
//       };

//       await utils.uploadFileToCloudinary(
//         filesList[0].path,
//         { public_id: 'Test/Private/path', folder: 'SaidTesting/test/private' },
//         callbackFunc
//       );
//     } catch (e) {
//       return res.status(500).send({ errorMsg: 'Failed To upload profile img', details: e });
//     }
//   }
// );
