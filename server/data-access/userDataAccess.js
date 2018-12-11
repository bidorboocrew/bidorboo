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

exports.resetAndSendPhoneVerificationPin = async (userId, phoneNumber) => {
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

      await sendTextService.sendText(
        updatedUser.phone.phoneNumber,
        `BidOrBoo: Phone verification. pinCode: ${phoneVerificationCode}. visit https://www.bidorboo.com`
      );
      resolve({ success: true });
    } catch (e) {
      reject(e);
    }
  });
};
exports.resetAndSendEmailVerificationCode = async (userId, emailAddress) => {
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
        `Your Email verification Code : ${emailVerificationCode}.
         Please visit https://www.bidorboo.com to verify your profile details
        `
      );

      resolve({ success: true });
    } catch (e) {
      reject(e);
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
  return new Promise(async (resolve, reject) => {
    try {
      if (userDetails.email || userDetails.phone) {
        const currentUser = await this.findOneByUserId(userId);

        const isDifferentEmailThanTheOneOnFile =
          userDetails.email &&
          userDetails.email.emailAddress &&
          userDetails.email.emailAddress !== currentUser.email.emailAddress;

        if (isDifferentEmailThanTheOneOnFile) {
          await this.resetAndSendEmailVerificationCode(userId, userDetails.email.emailAddress);
        }

        const isDifferentPhoneThanTheOneOnFile =
          userDetails.phone &&
          userDetails.phone.phoneNumber &&
          userDetails.phone.phoneNumber !== currentUser.phone.phoneNumber;
        if (isDifferentPhoneThanTheOneOnFile) {
          await this.resetAndSendPhoneVerificationPin(userId, userDetails.phone.phoneNumber);
        }

        // dealt with these fields and updated the user with the approperiate shit
        userDetails.email && delete userDetails.email;
        userDetails.phone && delete userDetails.phone;
      }

      const updatedUser = await User.findOneAndUpdate(
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
      resolve(updatedUser);
    } catch (e) {
      reject(e);
    }
  });
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
