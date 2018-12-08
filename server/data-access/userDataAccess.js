//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');
const schemaHelpers = require('./util_schemaPopulateProjectHelpers');

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

exports.createNewUser = async (userDetails) =>
  await new User({
    ...userDetails,
  }).save();

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

exports.updateUserProfileDetails = (userId, userDetails) =>
  User.findOneAndUpdate(
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
