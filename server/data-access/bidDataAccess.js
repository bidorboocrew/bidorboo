//handle all user data manipulations
const mongoose = require('mongoose');

const UserModel = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');

exports.bidDataAccess = {
  getAllBidsForUser: (mongoDbUserId) => {
    return UserModel.findById({ _id: mongoDbUserId }, { _postedBidsRef: 1 })
      .populate({
        path: '_postedBidsRef',
        populate: {
          path: '_jobRef',
          populate: {
            path: '_ownerRef',
            select: {
              _id: 1,
              displayName: 1,
              globalRating: 1,
              profileImage: 1,
            },
          },
        },
      })
      .lean(true)
      .exec();
  },
  // get jobs for a user and filter by a given state
  getAllBidsForUserByState: async (mongoDbUserId, stateFilter) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById({ _id: mongoDbUserId }, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { state: { $eq: stateFilter } },
            populate: {
              path: '_jobRef',
              select: {
                _ownerRef: 1,
                title: 1,
                state: 1,
                detailedDescription: 1,
                location: 1,
                stats: 1,
                addressText: 1,
                startingDateAndTime: 1,
                durationOfJob: 1,
                fromTemplateId: 1,
                reportThisJob: 1,
                createdAt: 1,
                updatedAt: 1,
              },
              populate: {
                path: '_ownerRef',
                select: {
                  _id: 1,
                  displayName: 1,
                  globalRating: 1,
                  profileImage: 1,
                },
              },
            },
          })
          .lean(true)
          .exec();

        resolve(user);
      } catch (e) {
        reject(e);
      }
    });
  },
  // get jobs for a user and filter by a given state
  getBidDetails: async (mongoDbUserId, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById({ _id: mongoDbUserId }, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            populate: {
              path: '_jobRef',
              select: {
                _ownerRef: 1,
                title: 1,
                state: 1,
                detailedDescription: 1,
                location: 1,
                stats: 1,
                startingDateAndTime: 1,
                durationOfJob: 1,
                fromTemplateId: 1,
                reportThisJob: 1,
                createdAt: 1,
                updatedAt: 1,
              },
              populate: {
                path: '_ownerRef',
                select: {
                  _id: 1,
                  displayName: 1,
                  globalRating: 1,
                  profileImage: 1,
                },
              },
            },
          })
          .lean(true)
          .exec();
        const theBid =
          user && user._postedBidsRef && user._postedBidsRef.length === 1
            ? user._postedBidsRef[0]
            : {};
        resolve(theBid);
      } catch (e) {
        reject(e);
      }
    });
  },
  //---------------------
  //---------------------
  //---------------------
  //---------------------
  markBidAsSeen: async (bidId) => {
    const isSuccessful = await BidModel.findOneAndUpdate(
      { _id: bidId },
      {
        $set: { isNewBid: false },
      }
    )
      .lean(true)
      .exec();
    return !!isSuccessful;
  },

  postNewBid: ({ userId, jobId, bidAmount, bidderId, userCurrency = 'CAD' }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newBid = await new BidModel({
          bidderId: userId,
          _bidderRef: bidderId,
          _jobRef: jobId,
          state: 'OPEN',
          hasJobOwnerSeenThis: false,
          bidAmount: { value: bidAmount, currency: userCurrency },
        }).save();

        const bidDetailsPopulateOptions = {
          path: '_jobRef',
          populate: {
            path: '_ownerRef',
            select: { _id: 1, displayName: 1, globalRating: 1, profileImage: 1 },
          },
        };
        const bidListDetails = {
          path: '_jobRef',
          populate: {
            path: '_bidsListRef',
            populate: {
              path: '_bidderRef',
              select: {
                _id: 1,
                _reviewsRef: 1,
                displayName: 1,
                globalRating: 1,
                profileImage: 1,
              },
            },
          },
        };

        //update the user and job model with this new bid
        const bidWithDetails = await Promise.all([
          UserModel.findOneAndUpdate(
            { _id: bidderId },
            {
              $push: { _postedBidsRef: newBid._id },
            },
            { new: true }
          )
            .lean(true)
            .exec(),
          BidModel.findById(newBid._id)
            .populate(bidDetailsPopulateOptions)
            .populate(bidListDetails)
            .lean(true)
            .exec(),
          JobModel.findOneAndUpdate(
            { _id: jobId },
            {
              $push: { _bidsListRef: newBid._id, bidderIds: userId },
            },
            { new: true }
          )
            .lean(true)
            .exec(),
        ]);

        const job = await JobModel.findById({ _id: jobId })
          .populate({
            path: '_ownerRef',
            select: { displayName: 1, profileImage: 1, _id: 1 },
          })
          .populate({
            path: '_bidsListRef',
            populate: {
              path: '_bidderRef',
              select: {
                _id: 1,
                _reviewsRef: 1,
                displayName: 1,
                globalRating: 1,
                profileImage: 1,
              },
            },
          })
          .lean(true)
          .exec();

        //index2 is the bid with details populated
        resolve(job);
      } catch (e) {
        reject(e);
      }
    });
  },
};
