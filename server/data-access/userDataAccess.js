//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const schemaHelpers = require('./util_schemaPopulateProjectHelpers');
const stripeServiceUtil = require('../services/stripeService').util;
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/BlowerTxt').TxtMsgingService;

exports.findSessionUserById = (id) =>
  User.findOne({ userId: id }, { userId: 1, _id: 1 })
    .lean(true)
    .exec();

exports.findOneByUserId = (userId) =>
  User.findOne({ userId })
    .lean(true)
    .exec();

exports.findUserAndAllNewNotifications = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bidsWithUpdatedStatus = ['BOO', 'WIN', 'CANCEL', 'AWARDED'];
      const user = await User.findOne({ userId }, schemaHelpers.UserFull)
        .populate({
          path: '_postedJobsRef',
          select: {
            _bidsListRef: 1,
            _reviewRef: 1,
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
              match: { $and: [{ bidderSubmitted: { $eq: true } }, { state: { $eq: 'AWAITING' } }] },
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
            },
            populate: {
              path: '_reviewRef',
              select: { _id: 1 },
              match: { $and: [{ bidderSubmitted: { $eq: true } }, { state: { $eq: 'AWAITING' } }] },
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

      resolve({
        ...user,
        _postedJobsRef: null,
        _postedBidsRef: null,
        z_notify_jobsWithNewBids,
        z_notify_myBidsWithNewStatus,
        z_track_reviewsToBeFilled,
        z_track_workToDo,
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

exports.createNewUser = async (userDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      let secretCodes = {};
      let newUser = {};
      let emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
      let phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);

      if (userDetails.email && userDetails.emailAddress) {
        secretCodes = {
          ...secretCodes,
          email: {
            [`${emailVerificationCode}`]: `${userDetails.email.emailAddress}`,
          },
        };
      }
      if (userDetails.phone && userDetails.phone.phoneNumber) {
        secretCodes = {
          ...secretCodes,
          phone: {
            [`${phoneVerificationCode}`]: `${userDetails.phone.phoneNumber}`,
          },
        };
      }
      if (secretCodes.email || secretCodes.phone) {
        newUser = await new User({
          ...userDetails,
          verification: {
            ...secretCodes,
          },
        }).save();
      } else {
        newUser = await new User({
          ...userDetails,
        }).save();
      }

      if (secretCodes.email) {
        sendGridEmailing.sendEmail(
          'bidorboocrew@gmail.com',
          newUser.email.emailAddress,
          'BidOrBoo: Email verification',
          `Your Email verification Code : ${emailVerificationCode}`
        );
      }

      if (secretCodes.phoneNumber) {
        sendTextService.sendText(
          newUser.phone.phoneNumber,
          `BidOrBoo: Phone verification. pinCode: ${phoneVerificationCode}`
        );
      }

      const newStripeConnectAcc = stripeServiceUtil.initializeConnectedAccount({
        _id: newUser._id.toString(),
        email: newUser.email.emailAddress,
        userId: newUser.userID,
        displayName: newUser.displayName,
      });

      this.updateUserProfileDetails(newUser.userId, {
        stripeConnect: { accId: newStripeConnectAcc.id },
      });
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
  let secretCodes = {};

  if (userDetails.email) {
    let emailVerificationCode = Math.floor(100000 + Math.random() * 900000);

    secretCodes = {
      ...secretCodes,
      'verification.email': {
        [`${emailVerificationCode}`]: `${userDetails.email}`,
      },
    };
    sendGridEmailing.sendEmail(
      'bidorboocrew@gmail.com',
      userDetails.email,
      'BidOrBoo: Email verification',
      `Your Email verification Code : ${emailVerificationCode}`
    );
  }
  if (userDetails.phoneNumber) {
    let phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
    secretCodes = {
      ...secretCodes,
      'verification.phone': {
        [`${phoneVerificationCode}`]: `${userDetails.phoneNumber}`,
      },
    };
    sendTextService.sendText(
      userDetails.phoneNumber,
      `BidOrBoo: Phone verification. pinCode: ${phoneVerificationCode}`
    );
  }
  if (secretCodes) {
    return User.findOneAndUpdate(
      { userId },
      {
        $set: { ...userDetails, ...secretCodes },
      },
      {
        new: true,
      }
    )
      .lean(true)
      .exec();
  }
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
exports.getUserStripeAccount = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userId }, { stripeConnect: 1 })
        .lean(true)
        .exec();
      resolve(user.stripeConnect);
    } catch (e) {
      reject(e);
    }
  });
};
