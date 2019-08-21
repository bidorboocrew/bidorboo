const userDataAccess = require('../data-access/userDataAccess');
const { jobDataAccess } = require('../data-access/jobDataAccess');

const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const utils = require('../utils/utilities');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');


const SchemaValidator = require('../middleware/SchemaValidator');

// We are using the formatted Joi Validation error
// Pass false as argument to use a generic error
const validateRequest = SchemaValidator(true);

// const cloudinary = require('cloudinary');
module.exports = (app) => {
  app.post(
    ROUTES.API.USER.POST.verifyEmail,
    requireBidorBooHost,
    requireLogin,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { code } = req.body.data;
        if (code) {
          const user = await userDataAccess.findOneByUserId(userId);

          const emailVerification = user.verification.email;
          const emailCorrespondingToTheCode = emailVerification && emailVerification[`${code}`];
          if (user.email.emailAddress === emailCorrespondingToTheCode) {
            const userData = {
              email: { ...user.email, isVerified: true },
            };
            const newUser = await userDataAccess.findByUserIdAndUpdate(userId, userData);
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
        e.safeMsg = 'Failed To verify Email';
        return next(e);
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.verifyPhone,
    requireBidorBooHost,
    requireLogin,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { code } = req.body.data;

        if (code) {
          const user = await userDataAccess.findOneByUserId(req.user.userId);

          const phoneVerification = user.verification.phone;
          const phoneNumberCorrespondingToTheCode =
            phoneVerification && phoneVerification[`${code}`];
          if (user.phone.phoneNumber === phoneNumberCorrespondingToTheCode) {
            const userData = {
              phone: { ...user.phone, isVerified: true },
            };
            const newUser = await userDataAccess.findByUserIdAndUpdate(userId, userData);
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
        e.safeMsg = 'Failed To verify Phone';
        return next(e);
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.resendVerificationEmail,
    requireBidorBooHost,
    requireLogin,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const user = await userDataAccess.findOneByUserId(userId);

        if (user) {
          const verificationRequest = await userDataAccess.resetAndSendEmailVerificationCode(
            userId,
            user.email.emailAddress
          );
          if (verificationRequest.success) {
            return res.send(verificationRequest);
          } else {
            return res.status(400).send({
              errorMsg: 'unexpected error occured sendVerificationEmail',
            });
          }
        } else {
          return res.status(403).send({
            errorMsg: 'verifyEmail failed due to missing params',
          });
        }
      } catch (e) {
        e.safeMsg = 'Failed To send verification email';
        return next(e);
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.resendVerificationMsg,
    requireBidorBooHost,
    requireLogin,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const user = await userDataAccess.findOneByUserId(userId);

        if (user) {
          const verificationRequest = await userDataAccess.resetAndSendPhoneVerificationPin(
            userId,
            user.phone.phoneNumber
          );
          if (verificationRequest.success) {
            res.send(verificationRequest);
          } else {
            return res.status(400).send({
              errorMsg: 'unexpected error occured send Verification Msg',
            });
          }
        } else {
          return res.status(403).send({
            errorMsg: 'verify Email failed due to missing params',
          });
        }
      } catch (e) {
        e.safeMsg = 'Failed To send verification message';
        return next(e);
      }
    }
  );

  app.get(ROUTES.API.USER.GET.currentUser, async (req, res, next) => {
    try {
      // xxxx
      // stripeServiceUtil.deleteAllStripeAccountsInMySystem(true);

      // const [balance, payoutsList] = await stripeServiceUtil.getConnectedAccountBalance(
      //   'acct_1EmZPhKXcpvKCLJw'
      // );

      // const x = await stripeServiceUtil.sendPayoutToExternalBank('acct_1EmZPhKXcpvKCLJw', 4800);
      // await jobDataAccess.BidOrBooAdmin.CleanUpAllExpiredNonAwardedJobs();
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findUserAndAllNewNotifications(req.user.userId);
        if (existingUser) {
          return res.send(existingUser);
        }
      }
      return res.send({});
    } catch (e) {
      e.safeMsg = 'Failed To get your user details';
      return next(e);
      // return res.status(400).send({ errorMsg: 'Failed To get current user', details: `${e}` });
    }
  });

  app.get(ROUTES.API.USER.GET.getMyPastRequestedServices, requireLogin, async (req, res, next) => {
    try {
      pasrRequestedServices = await userDataAccess.getMyPastRequestedServices(
        req.user._id.toString()
      );
      if (pasrRequestedServices && pasrRequestedServices._asProposerReviewsRef) {
        return res.send(pasrRequestedServices._asProposerReviewsRef);
      }
      return res.send({});
    } catch (e) {
      e.safeMsg = 'Failed To get your past requesterd services details';
      return next(e);
    }
  });

  app.get(ROUTES.API.USER.GET.getMyPastProvidedServices, requireLogin, async (req, res, next) => {
    try {
      pasProvidedServices = await userDataAccess.getMyPastProvidedServices(req.user._id.toString());
      if (pasProvidedServices && pasProvidedServices._asBidderReviewsRef) {
        return res.send(pasProvidedServices._asBidderReviewsRef);
      }
      return res.send({});
    } catch (e) {
      e.safeMsg = 'Failed To get your past provided services details';
      return next(e);
    }
  });

  app.get(ROUTES.API.USER.GET.otherUserProfileInfo, async (req, res, next) => {
    try {
      if (!req.query || !req.query.otherUserId) {
        return res.status(403).send({
          errorMsg: 'get otherUserProfileInfo failed due to missing params',
        });
      }
      const { otherUserId } = req.query;

      const otherUserDetails = await userDataAccess.findUserPublicDetails(otherUserId);
      if (otherUserDetails) {
        return res.send(otherUserDetails);
      }

      return res.send({});
    } catch (e) {
      e.safeMsg = 'Failed To get user public details';
      return next(e);
    }
  });

  app.put(ROUTES.API.USER.PUT.notificationSettings, requireLogin, async (req, res, next) => {
    try {
      const notificationSettings = req.body.data;
      if (!notificationSettings) {
        return res.status(403).send({
          errorMsg: 'notificationSettings failed due to missing params',
        });
      }
      const userId = req.user.userId;
      await userDataAccess.updateNotificationSettings(userId, notificationSettings);
      return res.send({ success: true });
    } catch (e) {
      e.safeMsg = 'Failed To get notification settings';
      return next(e);
    }
  });

  app.put(ROUTES.API.USER.PUT.updateOnboardingDetails, requireLogin, async (req, res, next) => {
    try {
      const { agreedToTOS } = req.body.data;

      if (!agreedToTOS) {
        return res.status(400).send({
          errorMsg: 'You Must accept our Terms of Use in order to procceed',
        });
      }

      let newDetails = {
        tos_acceptance: {
          Agreed: true,
          date: Math.floor(Date.now() / 1000), //HARD CODED
          ip: req.connection.remoteAddress, //HARD CODED
        },
        membershipStatus: 'ONBOARDED_MEMBER',
      };

      const userId = req.user.userId;
      await userDataAccess.updateUserProfileDetails(userId, newDetails);
      return res.send({ success: true });
    } catch (e) {
      e.safeMsg = 'Failed To update update Onboarding Details';
      return next(e);
    }
  });

  app.put(
    ROUTES.API.USER.PUT.userDetails,
    requireLogin,
    validateRequest,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const newProfileDetails = req.body.data;
        // cycle through the properties provided { name: blablabla, telephoneNumber : 123123123...etc}
        Object.keys(newProfileDetails).forEach((property) => {
          newProfileDetails[`${property}`] = newProfileDetails[`${property}`];
        });

        const userAfterUpdates = await userDataAccess.updateUserProfileDetails(
          userId,
          newProfileDetails
        );
        return res.send(userAfterUpdates);
      } catch (e) {
        e.safeMsg = 'Failed To update update user Details';
        return next(e);
      }
    }
  );

  app.put(ROUTES.API.USER.PUT.updateAppView, requireLogin, async (req, res, next) => {
    try {
      const { appViewId } = req.body.data;
      const userId = req.user.userId;
      const userAfterUpdates = await userDataAccess.updateUserAppView(userId, appViewId);
      return res.send(userAfterUpdates);
    } catch (e) {
      e.safeMsg = 'Failed To update update user app view';
      return next(e);
    }
  });

  app.put(ROUTES.API.USER.PUT.profilePicture, requireLogin, async (req, res, next) => {
    try {
      if (req.files && req.files.length === 1) {
        const filesList = req.files;
        const userId = req.user.userId;
        // const mongoUser_id = req.user._id;
        let newUserProfilePicImg = {};

        const updateUserWithNewProfileImg = (error, result) => {
          try {
            if (!error && result) {
              const { secure_url, public_id } = result;
              newUserProfilePicImg = { secure_url, public_id };
            }
          } catch (e) {
            e.safeMsg = 'Failed To upload user profile picture';
            return next(e);
          }
        };

        // delete old profile images if it exist (to save space)
        const currentUser = await userDataAccess.findUserImgDetails(userId);
        let oldPicPublicId = '';
        if (currentUser && currentUser.profileImage && currentUser.profileImage.public_id) {
          oldPicPublicId = currentUser.profileImage.public_id;
        }
        // https://cloudinary.com/documentation/image_transformations
        await utils.uploadFileToCloudinary(
          filesList[0].path,
          {
            folder: `profilePic`,
            transformation: [{ gravity: 'face', width: 150, height: 150, crop: 'thumb' }],
          },
          updateUserWithNewProfileImg
        );

        const userWithNewProfileImg = await userDataAccess.updateUserProfilePic(
          userId,
          newUserProfilePicImg.secure_url,
          newUserProfilePicImg.public_id
        );

        // delete the old pic
        if (oldPicPublicId) {
          utils.detroyExistingImg(currentUser.profileImage.public_id);
        }
        return res.send(userWithNewProfileImg);
      } else {
        return res.status(403).send({
          errorMsg: 'image upload failed due to missing params',
        });
      }
    } catch (e) {
      e.safeMsg = 'Failed To upload user profile picture';
      return next(e);
    }
  });
};

// The old way of putting the image where I use file upload onto the server
//  app.put(
//   ROUTES.API.USER.PUT.profilePicture,
//   requireBidorBooHost,
//   requireLogin,
//   async (req, res,next) => {
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
//           return res.status(400).send({ errorMsg: 'Failed To upload profile img', details: `${e}` });
//         } catch (e) {
//           return res.status(400).send({ errorMsg: 'Failed To upload to cloudinary', details: `${e}` });
//         }
//       };

//       await utils.uploadFileToCloudinary(
//         filesList[0].path,
//         { public_id: 'Test/Private/path', folder: 'SaidTesting/test/private' },
//         callbackFunc
//       );
//     } catch (e) {
//       return res.status(400).send({ errorMsg: 'Failed To upload profile img', details: `${e}` });
//     }
//   }
// );
