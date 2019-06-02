//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const schemaHelpers = require('./util_schemaPopulateProjectHelpers');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const ROUTES = require('../backend-route-constants');
const moment = require('moment');

exports.updateOnboardingDetails = (mongoUser_id, onBoardingDetails) => {
  this.updateUserProfileDetails(mongoUser_id, onBoardingDetails);
};

exports.getMyPastRequestedServices = (mongoUser_id) => {
  return User.findOne(
    { _id: mongoUser_id },
    {
      _id: 0,
      _asProposerReviewsRef: 1,
    }
  )
    .populate({
      path: '_asProposerReviewsRef',
      select: {
        _id: 1,
        jobId: 1,
        bidderReview: 1,
        bidderId: 1,
      },
      populate: [
        {
          path: 'bidderId',
          select: {
            displayName: 1,
            profileImage: 1,
            rating: 1,
            _awardedBidRef: 1,
          },
        },
        {
          path: 'jobId',
          select: {
            'processedPayment.proposerPaid': 1,
            state: 1,
            jobCompletion: 1,
            location: 1,
            startingDateAndTime: 1,
            fromTemplateId: 1,
            _ownerRef: 1,
          },
        },
      ],
    })
    .lean(true)
    .exec();
};

exports.getMyPastProvidedServices = (mongoUser_id) => {
  return User.findOne(
    { _id: mongoUser_id },
    {
      _id: 0,
      _asBidderReviewsRef: 1,
    }
  )
    .populate({
      path: '_asBidderReviewsRef',
      select: {
        _id: 1,
        jobId: 1,
        proposerReview: 1,
        proposerId: 1,
      },
      populate: [
        {
          path: 'proposerId',
          select: {
            displayName: 1,
            profileImage: 1,
            rating: 1,
          },
        },
        {
          path: 'jobId',
          select: {
            'processedPayment.bidderPayout': 1,
            state: 1,
            jobCompletion: 1,
            location: 1,
            startingDateAndTime: 1,
            fromTemplateId: 1,
            _awardedBidRef: 1,
          },
        },
      ],
    })
    .lean(true)
    .exec();
};

exports.findUserPublicDetails = (mongoUser_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const otherUserDetails = await User.findOne(
        { _id: mongoUser_id },
        {
          pushSubscription: 0,
          userRole: 0,
          settings: 0,
          extras: 0,
          canBid: 0,
          notifications: 0,
          canPost: 0,
          addressText: 0,
          verification: 0,
          password: 0,
          _postedJobsRef: 0,
          _postedBidsRef: 0,
        }
      )
        .populate({
          path: '_asBidderReviewsRef',
          select: {
            _id: 1,
            proposerReview: 1,
            proposerId: 1,
          },
          populate: {
            path: 'proposerId',
            select: {
              displayName: 1,
              profileImage: 1,
            },
          },
        })
        .populate({
          path: '_asProposerReviewsRef',
          select: {
            _id: 1,
            bidderReview: 1,
            bidderId: 1,
          },
          populate: {
            path: 'bidderId',
            select: {
              displayName: 1,
              profileImage: 1,
            },
          },
        })
        .lean(true)
        .exec();

      if (otherUserDetails) {
        resolve({
          ...otherUserDetails,
          email: { isVerified: otherUserDetails.email.isVerified },
          phone: { isVerified: otherUserDetails.phone.isVerified },
          stripeConnect: { isVerified: otherUserDetails.stripeConnect.isVerified },
        });
      }
      return {};
    } catch (e) {
      reject(e);
    }
  });
};

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

exports.findOneByEmailId = (loginEmailAddress, lean = true) =>
  User.findOne({ userId: loginEmailAddress })
    .lean(lean)
    .exec();

exports.checkIfUserAlreadyExist = (userId, registrationEmail, lean = true) =>
  User.findOne({ $or: [{ userId: userId }, { 'email.emailAddress': registrationEmail }] })
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
      // xxxxx maybe we should notify of canceled by tasker
      const bidsWithUpdatedStatus = ['WON', 'AWARDED', 'CANCELED_AWARDED_BY_REQUESTER'];

      const user = await User.findOne(
        { userId },
        {
          _asBidderReviewsRef: 0,
          _asProposerReviewsRef: 0,
          verification: 0,
          pushSubscription: 0,
          userRole: 0,
          tos_acceptance: 0,
          settings: 0,
          extras: 0,
          stripeConnect: 0,
          updatedAt: 0,
          password: 0,
        }
      )
        .populate({
          path: '_postedJobsRef',
          match: { state: { $in: ['OPEN', 'AWARDED', 'AWARDED_CANCELED_BY_BIDDER'] } },
          select: {
            _bidsListRef: 1,
            state: 1,
            fromTemplateId: 1,
            startingDateAndTime: 1,
          },
          populate: {
            path: '_bidsListRef',
            select: { isNewBid: 1 },
            match: { isNewBid: { $eq: true } },
          },
          // populate: [
          //   {
          //     path: '_bidsListRef',
          //     select: schemaHelpers.BidFull,
          //     match: { isNewBid: { $eq: true } },
          //   },
          //   // {
          //   path: '_reviewRef',
          //   select: { _id: 1 },
          //   match: { state: { $eq: 'AWAITING' } },
          // },
          // ],
        })
        .populate({
          path: '_postedBidsRef',
          match: { state: { $eq: 'WON' } },
          select: { _jobRef: 1 },
          populate: {
            path: '_jobRef',
            select: {
              startingDateAndTime: 1,
              fromTemplateId: 1,
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

      const startOfToday = moment()
        .tz('America/Toronto')
        .startOf('day')
        .toISOString();

      const endOfToday = moment()
        .tz('America/Toronto')
        .endOf('day')
        .toISOString();

      const z_jobsHappeningToday =
        user._postedJobsRef &&
        user._postedJobsRef
          .filter((job) => {
            return job.state === 'AWARDED';
          })
          .filter((job) => {
            const jobStartDate = job.startingDateAndTime;

            // normalize the start date to the same timezone to comapre
            const normalizedStartDate = moment(jobStartDate)
              .tz('America/Toronto')
              .toISOString();

            const isJobHappeningAfterToday = moment(normalizedStartDate).isAfter(startOfToday);
            const isJobHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(
              endOfToday
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

            const jobStartDate = referenceJob.startingDateAndTime;

            // normalize the start date to the same timezone to comapre
            const normalizedStartDate = moment(jobStartDate)
              .tz('America/Toronto')
              .toISOString();

            const isJobHappeningAfterToday = moment(normalizedStartDate).isAfter(startOfToday);
            const isJobHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(
              endOfToday
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
      const updatedUser = await User.findOneAndUpdate(
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

      sendTextService.sendPhoneVerificationText(
        updatedUser.phone.phoneNumber,
        phoneVerificationCode
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

      if (updatedUser && updatedUser.notifications && updatedUser.notifications.email) {
        sendGridEmailing.sendEmail({
          to: `${updatedUser.email.emailAddress}`,
          subject: `BidOrBoo: Email verification`,
          contentText: `To verify your email Please click: ${ROUTES.CLIENT.dynamicVerification(
            'Email',
            emailVerificationCode
          )}
          `,
          toDisplayName: `${updatedUser.displayName}`,
          contentHtml: `
          <p>Your BidOrBoo Email Verification Code is</p>
          <p>${emailVerificationCode}</p>

          <p>Click to verify your email Address</p>
          `,
          clickLink: `${ROUTES.CLIENT.dynamicVerification('Email', emailVerificationCode)}`,
          clickDisplayName: `Verify Email`,
        });
      }
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

exports.updateUserAppView = (userId, appView) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.findOneAndUpdate(
        { userId },
        {
          $set: { appView: `${appView}` },
        }
      );
      resolve({ success: true });
    } catch (e) {
      reject(e);
    }
  });
};

exports.updateNotificationSettings = (userId, notificationSettings) => {
  return new Promise(async (resolve, reject) => {
    try {
      let updatedUser = await User.findOneAndUpdate(
        { userId },
        {
          $set: { notifications: { ...notificationSettings } },
        }
      )
        .lean(true)
        .exec();

      resolve(updatedUser);
    } catch (e) {
      reject(e);
    }
  });
};

exports.updateUserLastSearchDetails = (
  userId,
  { searchRadius, location, addressText, selectedTemplateIds }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let updatedUser = await User.findOneAndUpdate(
        { userId },
        {
          $set: {
            notifications: {
              searchRadius,
              location,
              addressText,
              selectedTemplateIds,
            },
          },
        }
      )
        .lean(true)
        .exec();

      resolve(updatedUser);
    } catch (e) {
      reject(e);
    }
  });
};
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

exports.proposerPushesAReview = async (
  reviewId,
  proposerId,
  newFulfilledJobId,
  bidderId,
  newBidderGlobalRating,
  newTotalOfAllRatings,
  personalComment
) => {
  return await Promise.all([
    User.findOneAndUpdate(
      { _id: proposerId },
      {
        $push: { 'rating.fulfilledJobs': newFulfilledJobId },
      },
      {
        new: true,
      }
    )
      .lean(true)
      .exec(),
    User.findOneAndUpdate(
      { _id: bidderId },
      {
        $push: { _asBidderReviewsRef: reviewId },
        $set: {
          'rating.globalRating': newBidderGlobalRating,
          'rating.totalOfAllRatings': newTotalOfAllRatings,
          'rating.latestComment': personalComment,
        },
        $inc: { 'rating.numberOfTimesBeenRated': 1 },
      },
      {
        new: true,
      }
    )
      .lean(true)
      .exec(),
  ]);
};

exports.bidderPushesAReview = async (
  reviewId,
  bidderId,
  newFulfilledBidId,
  proposerId,
  newProposerGlobalRating,
  newTotalOfAllRatings,
  personalComment
) => {
  return await Promise.all([
    await User.findOneAndUpdate(
      { _id: bidderId },
      {
        $push: {
          'rating.fulfilledBids': newFulfilledBidId,
        },
      },
      {
        new: true,
      }
    )
      .lean(true)
      .exec(),
    await User.findOneAndUpdate(
      { _id: proposerId },
      {
        $push: { _asProposerReviewsRef: reviewId },
        $set: {
          'rating.globalRating': newProposerGlobalRating,
          'rating.totalOfAllRatings': newTotalOfAllRatings,
          'rating.latestComment': personalComment,
        },
        $inc: { 'rating.numberOfTimesBeenRated': 1 },
      },
      {
        new: true,
      }
    )
      .lean(true)
      .exec(),
  ]);
};

exports.getUserStripeAccount = async (mongoUser_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: mongoUser_id }, { stripeConnect: 1 })
        .lean(true)
        .exec();
      resolve(user.stripeConnect);
    } catch (e) {
      reject(e);
    }
  });
};
