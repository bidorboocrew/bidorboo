const userDataAccess = require('../data-access/userDataAccess');
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const { encryptData } = require('../utils/utilities');
const { celebrate } = require('celebrate');
const requireUserHasAStripeAccountOrInitalizeOne = require('../middleware/requireUserHasAStripeAccountOrInitalizeOne');
// const stripeServiceUtil = require('../services/stripeService').util;
const { bugsnagClient } = require('../utils/utilities');

const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const utils = require('../utils/utilities');
// const { requestDataAccess } = require('../data-access/requestDataAccess');
const {
  resetPasswordReqSchema,
  verifyViaCode,
  verifyPhoneViaCode,
  loggedoutEmailVerificationReq,
  notificationSettingsUpdateReq,
  agreeToTosReq,
  userDetailsReqSchema,
  updateAppViewReq,
  otherUserProfileInfo,
} = require('../routeSchemas/userRoutesReqSchema');

module.exports = (app) => {
  app.post(
    ROUTES.API.USER.POST.updateUserPassword,
    celebrate(resetPasswordReqSchema),
    async (req, res, next) => {
      try {
        const { verificationCode, emailAddress, password1 } = req.body.data;

        const user = await userDataAccess.findOneByEmailId(emailAddress);
        if (!user) {
          return res.status(400).send({
            safeMsg:
              'Sorry something went wrong, Make sure you used the right email and verification code',
          });
        }
        const { userId, verification } = user;
        const emailVerification = verification.email;
        const emailCorrespondingToTheCode =
          emailVerification && emailVerification[`${verificationCode}`];
        if (user.email.emailAddress === emailCorrespondingToTheCode) {
          const encryptedPassword = await encryptData(password1);

          const userData = {
            email: { ...user.email, isVerified: true },
            password: encryptedPassword,
          };
          await userDataAccess.findByUserIdAndUpdate(userId, userData);

          return res.send({ success: true });
        } else {
          return res.status(400).send({
            safeMsg:
              'Sorry something went wrong, Make sure you used the right email and verification code',
          });
        }
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg =
          "unexpected error occurred.We couldn't update your password, You can Chat with our customer support for further help";
        return next(e);
      }
    }
  );

  app.post(
    ROUTES.API.USER.POST.verifyEmail,
    celebrate(verifyViaCode),
    requireLogin,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { code } = req.body.data;

        const user = await userDataAccess.findOneByUserId(userId);

        const emailVerification = user.verification.email;
        const emailCorrespondingToTheCode = emailVerification && emailVerification[`${code}`];
        if (user.email.emailAddress === emailCorrespondingToTheCode) {
          const userData = {
            email: { ...user.email, isVerified: true },
          };
          await userDataAccess.findByUserIdAndUpdate(userId, userData);
          return res.send({ success: true });
        } else {
          return res.send({ success: false });
        }
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To verify Email';
        return next(e);
      }
    }
  );
  app.post(
    ROUTES.API.USER.POST.verifyPhone,
    celebrate(verifyPhoneViaCode),
    requireLogin,
    async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { code } = req.body.data;

        const user = await userDataAccess.findOneByUserId(req.user.userId);
        const { status } = await sendTextService.verifyPhoneCode(user.phone.phoneNumber, code);

        if (status === 'approved') {
          const userData = {
            phone: { ...user.phone, isVerified: true },
          };
          await userDataAccess.findByUserIdAndUpdate(userId, userData);
          return res.send({ success: true });
        } else {
          const userData = {
            phone: { ...user.phone, isVerified: false },
          };
          await userDataAccess.findByUserIdAndUpdate(userId, userData);
          return res.status(400).send({
            safeMsg:
              'Failed To verify Phone. You can Chat with our customer support for further help',
          });
        }
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To verify Phone';
        return next(e);
      }
    }
  );
  app.post(ROUTES.API.USER.POST.resendVerificationEmail, requireLogin, async (req, res, next) => {
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
            errorMsg: 'unexpected error occurred sendVerificationEmail',
          });
        }
      } else {
        return res.status(400).send({
          safeMsg: 'Failed To send verification email',
        });
      }
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To send verification email';
      return next(e);
    }
  });
  app.post(ROUTES.API.USER.POST.resendVerificationMsg, requireLogin, async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const user = await userDataAccess.findOneByUserId(userId);

      if (user) {
        const { success } = await userDataAccess.resetAndSendPhoneVerificationPin(
          userId,
          user.phone.phoneNumber
        );

        if (success) {
          res.send({ success });
        } else {
          return res.status(400).send({
            errorMsg: 'unexpected error occurred while sending Verification Msg',
          });
        }
      } else {
        return res.status(400).send({
          safeMsg: 'verify message failed',
        });
      }
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To send verification message';
      return next(e);
    }
  });

  app.post(
    ROUTES.API.USER.POST.loggedOutRequestEmailVerificationCode,
    celebrate(loggedoutEmailVerificationReq),
    async (req, res, next) => {
      try {
        const { emailAddress } = req.body.data;

        const user = await userDataAccess.findOneByEmailId(emailAddress);
        if (!user) {
          return res.status(400).send({
            safeMsg:
              'Sorry something went wrong, Make sure you spelled and used the right email as you used upon registration with BidOrBoo',
          });
        }

        const { success } = await userDataAccess.resetAndSendEmailVerificationCode(
          user.userId,
          user.email.emailAddress
        );

        if (success) {
          res.send({ success });
        } else {
          return res.status(400).send({
            safeMsg:
              'unexpected error occurred while sending Verification Email, You can Chat with our customer support for further help',
          });
        }
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg =
          'unexpected error occurred while sending Verification Email, You can Chat with our customer support for further help';
        return next(e);
      }
    }
  );

  app.get(ROUTES.API.USER.GET.currentUser, async (req, res, next) => {
    try {
      let existingUser = null;
      if (req.user) {
        existingUser = await userDataAccess.findUserAndAllNewNotifications(req.user._id);
        if (existingUser) {
          return res.send(existingUser);
        }
      }
      return res.send({});
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To get your user details';
      return next(e);
      // return res.status(400).send({ errorMsg: 'Failed To get current user', details: `${e}` });
    }
  });

  app.get(
    ROUTES.API.USER.GET.otherUserProfileInfo,
    celebrate(otherUserProfileInfo),
    async (req, res, next) => {
      try {
        const { otherUserId } = req.query;

        const otherUserDetails = await userDataAccess.findUserPublicDetails(otherUserId);
        if (otherUserDetails) {
          return res.send(otherUserDetails);
        }

        return res.send({});
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To get user public details';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.USER.PUT.notificationSettings,
    celebrate(notificationSettingsUpdateReq),
    requireLogin,
    async (req, res, next) => {
      try {
        const notificationSettings = req.body.data;
        if (!notificationSettings) {
          return res.status(400).send({
            errorMsg: 'notificationSettings failed due to missing params',
          });
        }
        const userId = req.user.userId;
        await userDataAccess.updateNotificationSettings(userId, notificationSettings);
        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To get notification settings';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.USER.PUT.updateOnboardingDetails,
    celebrate(agreeToTosReq),
    requireLogin,
    async (req, res, next) => {
      try {
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

        next();
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To update update Onboarding Details';
        return next(e);
      }
    },
    requireUserHasAStripeAccountOrInitalizeOne,
    (req, res, next) => {
      return res.send({ success: true });
    }
  );

  app.put(
    ROUTES.API.USER.PUT.userDetails,
    celebrate(userDetailsReqSchema),
    requireLogin,
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
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To update update user Details';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.USER.PUT.updateAppView,
    celebrate(updateAppViewReq),
    requireLogin,
    async (req, res, next) => {
      try {
        const { appViewId } = req.body.data;
        const userId = req.user.userId;
        await userDataAccess.updateUserAppView(userId, appViewId);
        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To update update user app view';
        return next(e);
      }
    }
  );

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
            bugsnagClient.notify(e);

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
        return res.status(400).send({
          errorMsg: 'image upload failed due to missing params',
        });
      }
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To upload user profile picture';
      return next(e);
    }
  });
};
