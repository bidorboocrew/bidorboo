//handle all user data manipulations
const mongoose = require('mongoose');
const moment = require('moment');
const UserModel = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const ROUTES = require('../backend-route-constants');
const utils = require('../utils/utilities');

exports.bidDataAccess = {
  confirmBidBelongsToOwner: (userMongoDBId, bidId) => {
    return BidModel.findOne({ _id: bidId, _bidderRef: userMongoDBId })
      .lean(true)
      .exec();
  },
  deleteOpenBid: async (userMongoDBId, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bidDetails = await BidModel.findById(bidId)
          .populate({
            path: '_jobRef',
            select: {
              _id: 1,
            },
          })
          .lean(true)
          .exec();
        if (!bidDetails || !bidDetails._jobRef || !bidDetails._jobRef._id) {
          reject('Error while deleting bid, Bid reference Not Found.');
        } else {
          const test = await Promise.all([
            JobModel.findOneAndUpdate(
              { _id: bidDetails._jobRef._id },
              { $pull: { _bidsListRef: bidDetails._id } }
            )
              .lean(true)
              .exec(),
            UserModel.findOneAndUpdate(
              { _id: userMongoDBId },
              { $pull: { _postedBidsRef: bidDetails._id } }
            )
              .lean(true)
              .exec(),
            BidModel.findOneAndRemove(bidDetails._id)
              .lean(true)
              .exec(),
          ]);
          resolve({ success: true, deletedBidId: bidId });
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  getBidById: (bidId) => {
    return BidModel.findById(bidId)
      .populate({
        path: '_bidderRef',
        select: {
          notifications: 1,
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
            notifications: 1,
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
  getUserAwardedBids: async (mongoDbUserId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById(mongoDbUserId.toString(), { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { state: { $in: ['WON', 'WON_SEEN'] } },
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
                createdAt: 1,
                updatedAt: 1,
              },
              match: {
                $or: [
                  { _reviewRef: { $exists: false } },
                  { '_reviewRef.bidderSubmitted': { $eq: false } },
                ],
              },
              populate: [
                {
                  path: '_ownerRef',
                  select: {
                    _id: 1,
                    displayName: 1,
                    rating: 1,
                    profileImage: 1,
                    notifications: 1,
                  },
                },
                {
                  path: '_reviewRef',
                },
              ],
            },
          })
          .lean(true)
          .exec((err, res) => {
            if (err) {
              reject(err);
            } else {
              let results = [];
              if (res._postedBidsRef && res._postedBidsRef.length > 0) {
                results = res._postedBidsRef
                  .filter((postedBid) => {
                    return postedBid && postedBid._jobRef;
                  })
                  .sort((a, b) => {
                    return moment(a._jobRef.startingDateAndTime).isSameOrAfter(
                      moment(b._jobRef.startingDateAndTime)
                    )
                      ? 1
                      : -1;
                  });
              }
              resolve({ _postedBidsRef: results });
            }
          });
      } catch (e) {
        reject(e);
      }
    });
  },
  // get jobs for a user and filter by a given state
  getAllUserBids: async (mongoDbUserId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userBids = await Promise.all([
          new Promise(async (resolve, reject) => {
            UserModel.findById(mongoDbUserId, { _postedBidsRef: 1 })
              .populate({
                path: '_postedBidsRef',
                match: { state: { $in: ['OPEN'] } },
                populate: {
                  path: '_jobRef',
                  select: {
                    _awardedBidRef: 1,
                    _ownerRef: 1,
                    state: 1,
                    detailedDescription: 1,
                    location: 1,
                    stats: 1,
                    startingDateAndTime: 1,
                    durationOfJob: 1,
                    fromTemplateId: 1,
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
              .lean({ virtuals: true })
              .exec((err, res) => {
                if (err) {
                  reject(err);
                } else {
                  let results = [];
                  if (res._postedBidsRef && res._postedBidsRef.length > 0) {
                    results = res._postedBidsRef
                      .filter((postedBid) => {
                        return postedBid && postedBid._jobRef;
                      })
                      .sort((a, b) => {
                        return moment(a._jobRef.startingDateAndTime).isSameOrAfter(
                          moment(b._jobRef.startingDateAndTime)
                        )
                          ? 1
                          : -1;
                      });
                  }

                  resolve(results);
                }
              });
          }),
          new Promise(async (resolve, reject) => {
            UserModel.findById(mongoDbUserId.toString(), { _postedBidsRef: 1 })
              .populate({
                path: '_postedBidsRef',
                match: { state: { $in: ['WON', 'WON_SEEN'] } },
                populate: {
                  path: '_jobRef',
                  select: {
                    _awardedBidRef: 1,
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
                  },
                  populate: [
                    {
                      path: '_ownerRef',
                      select: {
                        _id: 1,
                        displayName: 1,
                        rating: 1,
                        profileImage: 1,
                      },
                    },
                    {
                      path: '_awardedBidRef',
                      select: { _bidderRef: 1 },
                      populate: { path: '_bidderRef', select: { userId: 1 } },
                    },
                  ],
                },
              })
              .lean({ virtuals: true })
              .exec((err, res) => {
                if (err) {
                  reject(err);
                } else {
                  let results = [];
                  if (res._postedBidsRef && res._postedBidsRef.length > 0) {
                    results = res._postedBidsRef
                      .filter((postedBid) => {
                        return postedBid && postedBid._jobRef;
                      })
                      .sort((a, b) => {
                        return moment(a._jobRef.startingDateAndTime).isSameOrAfter(
                          moment(b._jobRef.startingDateAndTime)
                        )
                          ? 1
                          : -1;
                      });
                  }
                  resolve(results);
                }
              });
          }),
        ]);

        resolve({ postedBids: [...userBids[0], ...userBids[1]] });
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
            populate: [
              {
                path: '_jobRef',
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
              {
                path: '_bidderRef',
                select: {
                  _id: 1,
                  displayName: 1,
                  rating: 1,
                  profileImage: 1,
                  email: 1,
                  phone: 1,
                },
              },
            ],
          })
          .lean()
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
        const user = await UserModel.findById(mongoDbUserId, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            populate: {
              path: '_jobRef',
              select: {
                _ownerRef: 1,
                state: 1,
                detailedDescription: 1,
                location: 1,
                stats: 1,
                startingDateAndTime: 1,
                durationOfJob: 1,
                fromTemplateId: 1,
                extras: 1,
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
          .lean({ virtuals: true })
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
        $set: { 'bidAmount.value': bidAmount, isNewBid: true },
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

        const jobDetails = await JobModel.findById(jobId)
          .populate({
            path: '_ownerRef',
            select: {
              _id: 1,
              email: 1,
              phone: 1,
              _bidderRef: 1,
              pushSubscription: 1,
              notifications: 1,
            },
          })
          .lean()
          .exec();
        const ownerDetails = jobDetails._ownerRef;
        if (ownerDetails) {
          const ownerEmailAddress =
            ownerDetails.email && ownerDetails.email.emailAddress
              ? ownerDetails.email.emailAddress
              : '';

          const jobTemplate =
            utils.jobTemplateIdToDefinitionObjectMapper[`${jobDetails.fromTemplateId}`];
          const jobTitle = jobTemplate.TITLE || '';
          sendGridEmailing.sendNewBidRecievedEmail({
            to: ownerEmailAddress,
            toDisplayName: ownerDetails.displayName,
            taskName: jobTitle,
            clickLink: `${ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(jobId)}`,
          });
        }

        newBid && newBid.toObject ? resolve(newBid.toObject()) : resolve(newBid);
      } catch (e) {
        reject(e);
      }
    });
  },
};
