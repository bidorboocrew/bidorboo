//handle all user data manipulations
const mongoose = require('mongoose');

const UserModel = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');

exports.bidDataAccess = {
  getBidById: (bidId) => {
    return BidModel.findById(bidId)
      .populate({
        path: '_bidderRef',
        select: {
          _asBidderReviewsRef: 1,
          _asProposerReviewsRef: 1,
          rating: 1,
          userId: 1,
          displayName: 1,
          profileImage: 1,
          personalParagraph: 1,
          membershipStatus: 1,
          agreedToServiceTerms: 1,
          createdAt: 1,
          email: 1,
        },
      })
      .populate({
        path: '_jobRef',
        select: {
          _ownerRef: 1,
          title: 1,
          state: 1,
          detailedDescription: 1,
          jobCompletion: 1,
          location: 1,
          stats: 1,
          addressText: 1,
          startingDateAndTime: 1,
          durationOfJob: 1,
          fromTemplateId: 1,
          reported: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        populate: {
          path: '_ownerRef',
          select: {
            _id: 1,
            displayName: 1,
            rating: 1,
            profileImage: 1,
            email: 1,
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
        const user = await UserModel.findById(mongoDbUserId.toString(), { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { state: { $in: stateFilter } },
            populate: {
              path: '_jobRef',
              select: {
                _ownerRef: 1,
                title: 1,
                state: 1,
                detailedDescription: 1,
                jobCompletion: 1,
                location: 1,
                stats: 1,
                addressText: 1,
                startingDateAndTime: 1,
                durationOfJob: 1,
                fromTemplateId: 1,
                reported: 1,
                createdAt: 1,
                updatedAt: 1,
              },
              populate: {
                path: '_ownerRef',
                select: {
                  _id: 1,
                  displayName: 1,
                  rating: 1,
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

  getAwardedBidDetails: async (mongoDbUserId, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById({ _id: mongoDbUserId }, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            populate: {
              path: '_jobRef _bidderRef',
              select: {
                _id: 1,
                _ownerRef: 1,
                title: 1,
                state: 1,
                detailedDescription: 1,
                location: 1,
                stats: 1,
                jobCompletion: 1,
                startingDateAndTime: 1,
                durationOfJob: 1,
                fromTemplateId: 1,
                addressText: 1,
                reported: 1,
                createdAt: 1,
                updatedAt: 1,
                displayName: 1,
                rating: 1,
                profileImage: 1,
                email: 1,
                phone: 1,
                viewedBy: 1,
              },
              options: { sort: { 'startingDateAndTime': 1 } },
              populate: {
                path: '_ownerRef',
                select: {
                  _id: 1,
                  displayName: 1,
                  rating: 1,
                  profileImage: 1,
                  email: 1,
                  phone: 1,
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

  // get jobs for a user and filter by a given state
  getBidDetails: async (mongoDbUserId, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById({ _id: mongoDbUserId }, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            populate: {
              path: '_jobRef _bidderRef',
              select: {
                _id: 1,
                _ownerRef: 1,
                title: 1,
                state: 1,
                detailedDescription: 1,
                location: 1,
                stats: 1,
                startingDateAndTime: 1,
                durationOfJob: 1,
                fromTemplateId: 1,
                reported: 1,
                createdAt: 1,
                updatedAt: 1,
                displayName: 1,
                rating: 1,
                profileImage: 1,
                email: 1,
                phone: 1,
              },
              populate: {
                path: '_ownerRef',
                select: {
                  _id: 1,
                  displayName: 1,
                  rating: 1,
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
  updateBidState: async (bidId, newState) => {
    const isSuccessful = await BidModel.findOneAndUpdate(
      { _id: bidId },
      {
        $set: { state: newState },
      }
    )
      .lean(true)
      .exec();
    return !!isSuccessful;
  },
  updateBidValue: ({ userMongoDBId, bidId, bidAmount }) => {
    return BidModel.findOneAndUpdate(
      { _id: bidId, _bidderRef: userMongoDBId },
      {
        $set: { 'bidAmount.value': bidAmount, isNewBid: false },
      },
      { new: true }
    )
      .lean(true)
      .exec();
  },
  postNewBid: ({ userMongoDBId, jobId, bidAmount }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newBid = await new BidModel({
          _bidderRef: userMongoDBId,
          _jobRef: jobId,
          bidAmount: { value: bidAmount, currency: bidAmount.currency || 'CAD' },
        }).save();

        //update the user and job model with this new bid
        const updateRelativeModels = await Promise.all([
          UserModel.findOneAndUpdate(
            { _id: userMongoDBId },
            {
              $push: { _postedBidsRef: newBid._id },
            }
          )
            .lean(true)
            .exec(),
          JobModel.findOneAndUpdate(
            { _id: jobId },
            {
              $push: { _bidsListRef: newBid._id },
            }
          )
            .lean(true)
            .exec(),
        ]);
        newBid && newBid.toObject ? resolve(newBid.toObject()) : resolve(newBid);
      } catch (e) {
        reject(e);
      }
    });
  },
};
