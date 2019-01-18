//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const schemaHelpers = require('./util_schemaPopulateProjectHelpers');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/BlowerTxt').TxtMsgingService;
const ROUTES = require('../backend-route-constants');
const moment = require('moment');

exports.getUserPushSubscription = (userId) => {
  return User.findOne({ userId }, { pushSubscription: 1 })
    .lean(true)
    .exec();
};

exports.findSessionUserById = (id) =>
  User.findOne({ userId: id }, { userId: 1, _id: 1 })
    .lean(true)
    .exec();

exports.findOneByUserId = (userId, lean = true) =>
  User.findOne({ userId })
    .lean(lean)
    .exec();

exports.findByIdAndGetPopulatedJobs = (userId) =>
  User.findOne({ userId })
    .populate({ path: '_postedJobsRef' })
    .lean(true)
    .exec();

exports.findByIdAndGetPopulatedBids = (userId) =>
  User.findOne({ userId })
    .populate({ path: '_bidsListRef' })
    .lean(true)
    .exec();

exports.findUserAndAllNewNotifications = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bidsWithUpdatedStatus = ['BOO', 'WON', 'CANCEL', 'AWARDED'];
      const user = await User.findOne({ userId }, schemaHelpers.UserFull)
        .populate({
          path: '_postedJobsRef',
          match: { state: { $in: ['OPEN', 'AWARDED'] } },
          select: {
            _bidsListRef: 1,
            _reviewRef: 1,
            state: 1,
            fromTemplateId: 1,
            startingDateAndTime: 1,
          },
          populate: [
            {
              path: '_bidsListRef',
              select: schemaHelpers.BidFull,
              match: { isNewBid: { $eq: true } },
            },
            {
              path: '_reviewRef',
              select: { _id: 1 },
              match: { state: { $eq: 'AWAITING' } },
            },
          ],
        })
        .populate({
          path: '_postedBidsRef',
          match: { state: { $in: bidsWithUpdatedStatus } },
          select: schemaHelpers.BidFull,
          populate: {
            path: '_jobRef',
            select: {
              _reviewRef: 1,
              startingDateAndTime: 1,
              fromTemplateId: 1,
            },
            populate: {
              path: '_reviewRef',
              select: { _id: 1 },
              match: { state: { $eq: 'AWAITING' } },
            },
          },
        })
        .lean(true)
        .exec();

      let z_notify_jobsWithNewBids =
        user._postedJobsRef &&
        user._postedJobsRef.filter((job) => {
          return job._bidsListRef && job._bidsListRef.length > 0;
        });

      let z_notify_myBidsWithNewStatus =
        user._postedBidsRef &&
        user._postedBidsRef.filter((myBid) => {
          return bidsWithUpdatedStatus.includes(myBid.state);
        });

      let z_track_workToDo =
        user._postedBidsRef &&
        user._postedBidsRef.filter((myBid) => {
          return myBid.state === 'AWARDED';
        });

      let reviewsOnFullfilledJobs =
        user._postedJobsRef &&
        user._postedJobsRef.filter((job) => {
          return job._reviewRef && job._reviewRef;
        });
      let reviewsOnFullfilledBids =
        user._postedBidsRef &&
        user._postedBidsRef.filter((mybids) => {
          return mybids._jobRef && mybids._jobRef._reviewRef;
        });

      let z_track_reviewsToBeFilled = [...reviewsOnFullfilledBids, ...reviewsOnFullfilledJobs];

      const today = moment()
        .tz('America/Toronto')
        .startOf('day')
        .toISOString();

      const theNext24Hours = moment()
        .tz('America/Toronto')
        .add(1, 'day')
        .startOf('day')
        .toISOString();

      const z_jobsHappeningToday =
        user._postedJobsRef &&
        user._postedJobsRef
          .filter((job) => {
            return job.state === 'AWARDED';
          })
          .filter((job) => {
            const jobStartDate = job.startingDateAndTime.date;

            // normalize the start date to the same timezone to comapre
            const normalizedStartDate = moment(jobStartDate)
              .tz('America/Toronto')
              .toISOString();

            const isJobHappeningAfterToday = moment(normalizedStartDate).isAfter(today);
            const isJobHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(
              theNext24Hours
            );
            return isJobHappeningAfterToday && isJobHappeningBeforeTomorrow;
          });

      let z_bidsHappeningToday =
        user._postedBidsRef &&
        user._postedBidsRef
          .filter((myBid) => {
            return myBid.state === 'WON';
          })
          .filter((myBid) => {
            const referenceJob = myBid._jobRef;

            const jobStartDate = referenceJob.startingDateAndTime.date;

            // normalize the start date to the same timezone to comapre
            const normalizedStartDate = moment(jobStartDate)
              .tz('America/Toronto')
              .toISOString();

            const isJobHappeningAfterToday = moment(normalizedStartDate).isAfter(today);
            const isJobHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(
              theNext24Hours
            );
            return isJobHappeningAfterToday && isJobHappeningBeforeTomorrow;
          });

      resolve({
        ...user,
        z_notify_jobsWithNewBids,
        z_notify_myBidsWithNewStatus,
        z_track_reviewsToBeFilled,
        z_track_workToDo,
        z_jobsHappeningToday,
        z_bidsHappeningToday,
      });
    } catch (e) {
      reject(e);
    }
  });
};
exports.findUserImgDetails = (userId) =>
  User.findOne({ userId }, { profileImage: 1 })
    .lean(true)
    .exec();

exports.resetAndSendPhoneVerificationPin = (userId, phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);

      // updte user with this new info
      const updatedUser = User.findOneAndUpdate(
        { userId },
        {
          $set: {
            phone: {
              phoneNumber: phoneNumber,
              isVerified: false,
            },
            'verification.phone': {
              [`${phoneVerificationCode}`]: `${phoneNumber}`,
            },
          },
        },
        {
          new: true,
        }
      )
        .lean(true)
        .exec();

      await sendTextService.sendText(
        updatedUser.phone.phoneNumber,
        `BidOrBoo: click on the link to verify your phone Phone verification.
        ${ROUTES.CLIENT.VERIFICATION_phoneDynamic(phoneVerificationCode)}`
      );
      resolve({ success: true, updatedUser: updatedUser });
    } catch (e) {
      reject({ error: e, success: true });
    }
  });
};
exports.resetAndSendEmailVerificationCode = (userId, emailAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      let emailVerificationCode = Math.floor(100000 + Math.random() * 900000);

      const updatedUser = await User.findOneAndUpdate(
        { userId },
        {
          $set: {
            email: {
              emailAddress: emailAddress,
              isVerified: false,
            },
            'verification.email': {
              [`${emailVerificationCode}`]: `${emailAddress}`,
            },
          },
        },
        {
          new: true,
        }
      )
        .lean(true)
        .exec();

      sendGridEmailing.sendEmail(
        'bidorboocrew@gmail.com',
        updatedUser.email.emailAddress,
        'BidOrBoo: Email verification',
        `To verify your email Please click: ${ROUTES.CLIENT.VERIFICATION_emailDynamic(
          emailVerificationCode
        )}
        `
      );

      resolve({ success: true });
    } catch (e) {
      reject({ error: e, success: false });
    }
  });
};

exports.createNewUser = async (userDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newUser = await new User({
        ...userDetails,
      }).save();

      if (newUser.email.emailAddress) {
        this.resetAndSendEmailVerificationCode(newUser.userId, newUser.email.emailAddress);
      }

      if (newUser.phone.phoneNumber) {
        this.resetAndSendPhoneVerificationPin(newUser.userId, newUser.phone.phoneNumber);
      }

      // intentionally did not await on this to speed up login
      // const newStripeConnectAcc = stripeServiceUtil.initializeConnectedAccount(
      //   {
      //     _id: newUser._id.toString(),
      //     email: newUser.email.emailAddress,
      //     userId: newUser.userId,
      //     displayName: newUser.displayName,
      //   }
      // );

      // do this behind the scene  ^

      resolve(newUser.toObject());
    } catch (e) {
      reject(e);
    }
  });
};

exports.updateUserProfilePic = (userId, imgUrl, imgPublicId) =>
  User.findOneAndUpdate(
    { userId },
    {
      $set: {
        profileImage: {
          url: imgUrl,
          public_id: imgPublicId,
        },
      },
    },
    {
      new: true,
    }
  )
    .lean(true)
    .exec();

exports.updateUserProfileDetails = (userId, userDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      let updatedUser = {};

      if (userDetails.email || userDetails.phone) {
        const currentUser = await this.findOneByUserId(userId);

        const isDifferentEmailThanTheOneOnFile =
          userDetails.email &&
          userDetails.email.emailAddress &&
          userDetails.email.emailAddress !== currentUser.email.emailAddress;

        if (isDifferentEmailThanTheOneOnFile) {
          emailVerificationReq = await this.resetAndSendEmailVerificationCode(
            userId,
            userDetails.email.emailAddress
          );

          updatedUser = emailVerificationReq.updatedUser;
        }

        const isDifferentPhoneThanTheOneOnFile =
          userDetails.phone &&
          userDetails.phone.phoneNumber &&
          userDetails.phone.phoneNumber !== currentUser.phone.phoneNumber;
        if (isDifferentPhoneThanTheOneOnFile) {
          phoneVerificationReq = await this.resetAndSendPhoneVerificationPin(
            userId,
            userDetails.phone.phoneNumber
          );
          updatedUser = phoneVerificationReq.updatedUser;
        }

        // dealt with these fields and updated the user with the approperiate shit
        userDetails.email && delete userDetails.email;
        userDetails.phone && delete userDetails.phone;
      }

      if (userDetails && Object.keys(userDetails).length > 0) {
        updatedUser = await User.findOneAndUpdate(
          { userId },
          {
            $set: { ...userDetails },
          },
          {
            new: true,
          }
        )
          .lean(true)
          .exec();
      }

      resolve(updatedUser);
    } catch (e) {
      reject(e);
    }
  });
};

exports.findByUserIdAndUpdate = (userId, userDetails) => {
  return User.findOneAndUpdate(
    { userId },
    {
      $set: { ...userDetails },
    },
    {
      new: true,
    }
  )
    .lean(true)
    .exec();
};
exports.getUserStripeAccount = async (mongodbUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: mongodbUserId }, { stripeConnect: 1 })
        .lean(true)
        .exec();
      resolve(user.stripeConnect);
    } catch (e) {
      reject(e);
    }
  });
};
