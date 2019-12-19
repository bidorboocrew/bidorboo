//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const moment = require('moment');
const stripeServiceUtil = require('../services/stripeService').util;

exports.updateStripeAccountRequirementsDetails = ({
  eventId,
  userId,
  accId,
  chargesEnabled,
  payoutsEnabled,
  accRequirements,
}) => {
  const {
    disabled_reason,
    current_deadline,
    past_due,
    currently_due,
    eventually_due,
  } = accRequirements;

  return User.findOneAndUpdate(
    {
      userId,
      // 'stripeConnect.accId': { $eq: accId },
      'stripeConnect.processedWebhookEventIds': { $ne: eventId },
    },
    {
      $set: {
        payoutsEnabled,
        'stripeConnect.isVerified': payoutsEnabled && chargesEnabled,
        'stripeConnect.payoutsEnabled': payoutsEnabled,
        'stripeConnect.chargesEnabled': chargesEnabled,
        'stripeConnect.accRequirements': {
          disabled_reason,
          current_deadline,
          past_due,
          currently_due,
          eventually_due,
        },
      },
      $push: { 'stripeConnect.processedWebhookEventIds': eventId },
    }
  )
    .lean(true)
    .exec();
};

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
        taskerReview: 1,
        taskerId: 1,
      },
      populate: [
        {
          path: 'taskerId',
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
            state: 1,
            taskerConfirmedCompletion: 1,
            location: 1,
            jobTitle: 1,
            startingDateAndTime: 1,
            templateId: 1,
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
      _asTaskerReviewsRef: 1,
    }
  )
    .populate({
      path: '_asTaskerReviewsRef',
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
            state: 1,
            taskerConfirmedCompletion: 1,
            location: 1,
            jobTitle: 1,
            startingDateAndTime: 1,
            templateId: 1,
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
          notifications: 0,
          addressText: 0,
          verification: 0,
          password: 0,
          _postedJobsRef: 0,
          _postedBidsRef: 0,
        }
      )
        .populate({
          path: '_asTaskerReviewsRef',
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
            taskerReview: 1,
            taskerId: 1,
          },
          populate: {
            path: 'taskerId',
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

exports.checkIfUserEmailAlreadyExist = (registrationEmail) =>
  User.findOne({ 'email.emailAddress': registrationEmail })
    .lean(true)
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

exports.findUserAndAllNewNotifications = async (mongoUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // xxxxx maybe we should notify of canceled by tasker
      const jobStatesWhereTaskerNeedsToBeNotified = [
        'AWARDED',
        'AWARDED_JOB_CANCELED_BY_REQUESTER',
        'DONE',
        'DISPUTE_RESOLVED',
      ];

      const jobStatesWhereRequesterNeedsToBeNotified = [
        'OPEN',
        'AWARDED_JOB_CANCELED_BY_TASKER',
        'DISPUTE_RESOLVED',
      ];

      const user = await User.findById(mongoUserId, {
        password: 0,
        pushSubscription: 0,
        userRole: 0,
        picId: 0,
        stripeCustomerAccId: 0,
      })
        .populate({
          path: '_postedJobsRef',
          match: { state: { $in: jobStatesWhereRequesterNeedsToBeNotified } },
          select: {
            _bidsListRef: 1,
            state: 1,
            templateId: 1,
          },
          populate: {
            path: '_bidsListRef',
            select: { isNewBid: 1 },
            match: { isNewBid: { $eq: true } },
          },
        })
        .populate({
          path: '_postedBidsRef',
          select: { _jobRef: 1 },
          populate: {
            path: '_jobRef',
            match: { state: { $in: jobStatesWhereTaskerNeedsToBeNotified } },
            select: {
              templateId: 1,
              state: 1,
            },
          },
        })
        .lean(true)
        .exec();

      console.log(user._postedBidsRef);
      let z_notify_jobsWithNewUnseenState =
        user._postedJobsRef &&
        user._postedJobsRef.filter((job) => {
          // special case
          if (job.state === 'OPEN') {
            const jobWithNewUnseenBid = job._bidsListRef && job._bidsListRef.length > 0;
            return jobWithNewUnseenBid;
          } else {
            return true;
          }
        });

      let z_notify_myBidsWithNewStatus =
        user._postedBidsRef &&
        user._postedBidsRef.filter((myBid) => {
          const theAssociatedJob = myBid._jobRef;
          if (!!theAssociatedJob) {
            return true;
          }
          return false;
        });

      user._postedBidsRef = [];
      user._postedJobsRef = [];
      resolve({
        ...user,
        z_notify_jobsWithNewUnseenState,
        z_notify_myBidsWithNewStatus,
      });
    } catch (e) {
      reject(e);
    }
  });
};
exports.findUserImgDetails = (userId) => {
  return User.findOne({ userId }, { profileImage: 1 })
    .lean(true)
    .exec();
};
exports.resetAndSendPhoneVerificationPin = (userId, phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      // updte user with this new info
      const updatedUser = await User.findOneAndUpdate(
        { userId },
        {
          $set: {
            phone: {
              phoneNumber: phoneNumber,
              isVerified: false,
            },
          },
        },
        {
          new: true,
        }
      )
        .lean(true)
        .exec();

      sendTextService.verifyPhone(updatedUser.phone.phoneNumber);
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

      sendGridEmailing.sendEmailVerificationCode({
        to: `${updatedUser.email.emailAddress}`,
        emailVerificationCode,
        toDisplayName: `${updatedUser.displayName}`,
      });

      resolve({ success: true });
    } catch (e) {
      reject({ error: e, success: false });
    }
  });
};

exports.createNewUser = async (userDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = await stripeServiceUtil.initializeCustomer({
        email: userDetails.email.emailAddress,
        name: userDetails.displayName,
      });

      const newUser = await new User({
        ...userDetails,
        stripeCustomerAccId: id,
      }).save();

      if (newUser.email.emailAddress && !newUser.email.isVerified) {
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
  { searchRadius, location, addressText, tasksTypeFilter }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let updatedUser = await User.findOneAndUpdate(
        { userId },
        {
          $set: {
            lastSearch: {
              searchRadius,
              location: { type: 'Point', coordinates: [location.lng, location.lat] },
              addressText,
              tasksTypeFilter,
            },
          },
        },
        { new: true }
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
  taskerId,
  newTaskerGlobalRating,
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
      { _id: taskerId },
      {
        $push: { _asTaskerReviewsRef: reviewId },
        $set: {
          'rating.globalRating': newTaskerGlobalRating,
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

exports.taskerPushesAReview = async (
  reviewId,
  taskerId,
  newFulfilledBidId,
  proposerId,
  newProposerGlobalRating,
  newTotalOfAllRatings,
  personalComment
) => {
  return await Promise.all([
    await User.findOneAndUpdate(
      { _id: taskerId },
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
