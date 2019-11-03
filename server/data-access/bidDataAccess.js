//handle all user data manipulations
const mongoose = require('mongoose');
const moment = require('moment');
const UserModel = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');
const ROUTES = require('../backend-route-constants');
const utils = require('../utils/utilities');
const stripeServiceUtil = require('../services/stripeService').util;
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

exports.bidDataAccess = {
  confirmBidBelongsToOwner: (mongoUser_id, bidId) => {
    return BidModel.findOne({ _bidderRef: mongoUser_id, _id: bidId })
      .lean(true)
      .exec();
  },
  cancelAwardedBid: async (mongoUser_id, bidId) => {
    /**
     *
     * What we want to accomplish here
     * - refund full to requester
     * - update status of the awarded bid to canceled by tasker
     * - update tasker global rating to reflect -1/4 star and tasker missed count
     *
     * - if Task is PAST DUE:
     *        cancel task set status as will be deleted in 48
     * - if Task is NOT PAST DUE:
     *        Remove awarded bid
     *        Update status to have bidders
     *
     * - push notify to both informing them of this change
     * especially the case of not past due emphasizethat user can
     * select a new tasker
     *
     */
    return new Promise(async (resolve, reject) => {
      try {
        const bidDetails = await BidModel.findOne({
          _bidderRef: mongoUser_id,
          _id: bidId,
          state: { $in: ['AWARDED', 'AWARDED_SEEN'] },
        })
          .populate([
            {
              path: '_bidderRef',
              select: {
                rating: 1,
                _id: 1,
              },
            },
            {
              path: '_jobRef',
              select: { _id: 1, _ownerRef: 1, processedPayment: 1, startingDateAndTime: 1 },
            },
          ])
          .lean(true)
          .exec();

        if (
          !bidDetails ||
          !bidDetails._id ||
          !bidDetails._jobRef ||
          !bidDetails._jobRef._id ||
          !bidDetails._jobRef._ownerRef ||
          !bidDetails._jobRef.processedPayment ||
          !bidDetails._jobRef.startingDateAndTime ||
          !bidDetails._bidderRef
        ) {
          return reject(
            'Error while canceling the awarded bid, contact us at bidorboocrew@bidorboo.com'
          );
        } else {
          const requesterId = bidDetails._jobRef._ownerRef;
          const paymentDetails = bidDetails._jobRef.processedPayment;

          const requestedJobId = bidDetails._jobRef._id;
          const taskerId = bidDetails._bidderRef;
          const {
            requesterDisplayName,
            taskerDisplayName,
            jobDisplayName,
            requestLinkForRequester,
            requestLinkForTasker,
            requesterEmailAddress,
            requesterPhoneNumber,
            taskerEmailAddress,
            taskerPhoneNumber,
            allowedToEmailRequester,
            allowedToEmailTasker,
            allowedToTextRequester,
            allowedToTextTasker,
            allowedToPushNotifyRequester,
            allowedToPushNotifyTasker,
            requesterPushNotSubscription,
            taskerPushNotSubscription,
            ownerRating,
            taskerRating,
          } = await exports.bidDataAccess._getAwardedJobOwnerBidderAndRelevantNotificationDetails(
            requestedJobId
          );

          const newTotalOfAllRatings = taskerRating.totalOfAllRatings + 1.25;
          const newTotalOfAllTimesBeenRated = taskerRating.numberOfTimesBeenRated + 1;
          const newGlobalRating = Math.max(newTotalOfAllRatings / newTotalOfAllTimesBeenRated, 0);

          // xxx critical
          const refundCharge = await stripeServiceUtil.fullRefundTransaction({
            ...paymentDetails,
            metadata: {
              requesterId: requesterId.toString(),
              requesterEmailAddress,
              taskerId: taskerId.toString(),
              taskerEmailAddress,
              requestedJobId: requestedJobId.toString(),
              awardedBidId: bidDetails._id.toString(),
              note: 'Tasker cancelled an awarded request',
            },
          });

          if (refundCharge.status === 'succeeded') {
            const [updatedJob, updatedBid, updatedTasker] = await Promise.all([
              JobModel.findOneAndUpdate(
                { _id: requestedJobId, _ownerRef: requesterId },
                {
                  $set: {
                    state: 'AWARDED_JOB_CANCELED_BY_BIDDER',
                    'processedPayment.refund': {
                      amount: refundCharge.amount,
                      charge: refundCharge.charge,
                      id: refundCharge.id,
                      status: refundCharge.status,
                    },
                  },
                  $push: { hideFrom: taskerId },
                  $pull: { _bidsListRef: bidDetails._id },
                },
                { new: true }
              )
                .lean(true)
                .exec(),
              BidModel.findByIdAndUpdate(
                bidId,
                {
                  $set: { state: 'AWARDED_BID_CANCELED_BY_TASKER' },
                },
                { new: true }
              )
                .lean(true)
                .exec(),
              UserModel.findByIdAndUpdate(
                taskerId,
                {
                  $set: {
                    'rating.latestComment':
                      'BidOrBoo Auto Review: Cancelled Thier Request After Making an Agreement with A Tasker',
                  },
                  $push: {
                    'rating.canceledBids': bidId,
                    'rating.globalRating': newGlobalRating,
                    'rating.numberOfTimesBeenRated': newTotalOfAllTimesBeenRated,
                    'rating.totalOfAllRatings': newTotalOfAllRatings,
                  },
                },
                { new: true }
              )
                .lean(true)
                .exec(),
            ]);

            if (allowedToEmailRequester) {
              // send communication to both about the cancellation
              sendGridEmailing.tellRequeterThatTheTaskerHaveCancelledAnAwardedJob({
                to: requesterEmailAddress,
                requestTitle: jobDisplayName,
                toDisplayName: requesterDisplayName,
                linkForOwner: requestLinkForRequester,
              });
            }
            if (allowedToEmailTasker) {
              sendGridEmailing.tellTaskerThatTheyCancelledJob({
                to: taskerEmailAddress,
                requestTitle: jobDisplayName,
                toDisplayName: taskerDisplayName,
                linkForBidder: requestLinkForTasker,
              });
            }

            if (allowedToTextRequester) {
              sendTextService.sendJobIsCancelledText(
                requesterPhoneNumber,
                jobDisplayName,
                requestLinkForRequester
              );
            }
            if (allowedToTextTasker) {
              sendTextService.sendJobIsCancelledText(
                taskerPhoneNumber,
                jobDisplayName,
                requestLinkForTasker
              );
            }

            if (allowedToPushNotifyRequester) {
              WebPushNotifications.pushAwardedJobWasCancelled(requesterPushNotSubscription, {
                requestTitle: jobDisplayName,
                urlToLaunch: requestLinkForRequester,
              });
            }
            if (allowedToPushNotifyTasker) {
              WebPushNotifications.pushAwardedJobWasCancelled(taskerPushNotSubscription, {
                requestTitle: requestLinkForRequester,
                urlToLaunch: requestLinkForTasker,
              });
            }
            // -------------notify

            // -------------------------------- assert things sxxxxx
            if (!updatedJob._id || !updatedJob.processedPayment.refund) {
              return reject({ success: false, ErrorMsg: 'failed to update the associated job' });
            }
            if (!updatedBid._id || updatedBid.state !== 'AWARDED_BID_CANCELED_BY_TASKER') {
              return reject({ success: false, ErrorMsg: 'failed to update the associated bid' });
            }
            if (
              !updatedTasker._id ||
              !updatedTasker.rating ||
              !updatedTasker.rating.canceledBids ||
              !updatedTasker.rating.canceledBids.length > 0
            ) {
              const addedThisToCanceledBids = updatedTasker.rating.canceledBids.some(
                (canceledBid) => {
                  return canceledBid.toString() === bidId;
                }
              );
              if (!addedThisToCanceledBids) {
                return reject({
                  success: false,
                  ErrorMsg: 'failed to update the associated Tasker',
                });
              }
            }
            return resolve({ success: true, bidId });
            // ^-------- assert things xxxxxxxxxxxxxxxxxxxxxxxxx
          } else {
            return reject({
              refund: refundCharge,
              errorMsg: 'refund status failed we will get in touch with you shortly',
            });
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  },

  _getAwardedJobOwnerBidderAndRelevantNotificationDetails: async (jobId) => {
    const awardedJob = await JobModel.findById(jobId)
      .populate({
        path: '_awardedBidRef',
        select: {
          _bidderRef: 1,
          isNewBid: 1,
          state: 1,
          bidAmount: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        populate: {
          path: '_bidderRef',
          select: {
            _id: 1,
            email: 1,
            phone: 1,
            pushSubscription: 1,
            notifications: 1,
            displayName: 1,
          },
        },
      })
      .populate({
        path: '_ownerRef',
        select: {
          _id: 1,
          displayName: 1,
          email: 1,
          phone: 1,
          pushSubscription: 1,
          notifications: 1,
        },
      })
      .lean({ virtuals: true })
      .exec();

    const { _ownerRef, _awardedBidRef, processedPayment } = awardedJob;
    const awardedBidId = _awardedBidRef._id.toString();
    const requestedJobId = awardedJob._id.toString();

    const ownerDetails = _ownerRef;
    const awardedBidderDetails = _awardedBidRef._bidderRef;

    const requesterId = _ownerRef._id.toString();
    const taskerId = awardedBidderDetails._id.toString();

    const requesterDisplayName = ownerDetails.displayName;
    const taskerDisplayName = awardedBidderDetails.displayName;
    const jobDisplayName = awardedJob.jobTitle || awardedJob.templateId;

    const requestLinkForRequester = ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId);
    const requestLinkForTasker = ROUTES.CLIENT.BIDDER.dynamicCurrentAwardedBid(awardedBidId);

    const requesterPushNotSubscription = ownerDetails.pushSubscription;
    const taskerPushNotSubscription = awardedBidderDetails.pushSubscription;

    const requesterEmailAddress =
      ownerDetails.email && ownerDetails.email.emailAddress ? ownerDetails.email.emailAddress : '';
    const requesterPhoneNumber =
      ownerDetails.phone && ownerDetails.phone.phoneNumber ? ownerDetails.phone.phoneNumber : '';

    const taskerEmailAddress =
      awardedBidderDetails.email && awardedBidderDetails.email.emailAddress
        ? awardedBidderDetails.email.emailAddress
        : '';
    const taskerPhoneNumber =
      awardedBidderDetails.phone && awardedBidderDetails.phone.phoneNumber
        ? awardedBidderDetails.phone.phoneNumber
        : '';

    const allowedToEmailRequester = ownerDetails.notifications && ownerDetails.notifications.email;
    const allowedToEmailTasker =
      awardedBidderDetails.notifications && awardedBidderDetails.notifications.email;

    const allowedToTextRequester = ownerDetails.notifications && ownerDetails.notifications.text;
    const allowedToTextTasker =
      awardedBidderDetails.notifications && awardedBidderDetails.notifications.text;

    const allowedToPushNotifyRequester =
      ownerDetails.notifications && ownerDetails.notifications.push;
    const allowedToPushNotifyTasker =
      awardedBidderDetails.notifications && awardedBidderDetails.notifications.push;

    return {
      requestedJobId,
      awardedBidId,
      requesterId,
      taskerId,
      requesterDisplayName,
      taskerDisplayName,
      jobDisplayName,
      requestLinkForRequester,
      requestLinkForTasker,
      requesterEmailAddress,
      requesterPhoneNumber,
      taskerEmailAddress,
      taskerPhoneNumber,
      allowedToEmailRequester,
      allowedToEmailTasker,
      allowedToTextRequester,
      allowedToTextTasker,
      allowedToPushNotifyRequester,
      allowedToPushNotifyTasker,
      requesterPushNotSubscription,
      taskerPushNotSubscription,
      processedPayment,
    };
  },
  deleteOpenBid: async (mongoUser_id, bidId) => {
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
          await Promise.all([
            JobModel.findOneAndUpdate(
              { _id: bidDetails._jobRef._id },
              { $pull: { _bidsListRef: bidDetails._id } }
            )
              .lean(true)
              .exec(),
            UserModel.findOneAndUpdate(
              { _id: mongoUser_id },
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
          templateId: 1,
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
  getUserAwardedBids: async (mongoUser_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById(mongoUser_id.toString(), { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { state: { $in: ['AWARDED', 'AWARDED_SEEN'] } },
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
                templateId: 1,
                createdAt: 1,
                updatedAt: 1,
              },
              match: {
                $or: [
                  { _reviewRef: { $exists: false } },
                  { '_reviewRef.requiresBidderReview': { $eq: true } },
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
              resolve({ _postedBidsRef: results });
            }
          });
      } catch (e) {
        reject(e);
      }
    });
  },
  // get jobs for a user and filter by a given state
  getAllUserBids: async (mongoUser_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [openBids, allOtherBids] = await Promise.all([
          new Promise(async (resolve, reject) => {
            UserModel.findById(mongoUser_id, { _postedBidsRef: 1 })
              .populate({
                path: '_postedBidsRef',
                match: {
                  state: {
                    $in: ['OPEN'],
                  },
                },
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
                    templateId: 1,
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
            UserModel.findById(mongoUser_id, { _postedBidsRef: 1 })
              .populate({
                path: '_postedBidsRef',
                match: {
                  state: {
                    $in: [
                      'AWARDED_BID_CANCELED_BY_TASKER',
                      'AWARDED_BID_CANCELED_BY_REQUESTER',
                      'AWARDED',
                      'AWARDED_SEEN',
                      'DONE',
                      'PAYMENT_RELEASED',
                    ],
                  },
                },
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
                    templateId: 1,
                    _reviewRef: 1,
                  },
                  populate: [
                    {
                      path: '_reviewRef',
                      select: {
                        proposerReview: 1,
                        bidderReview: 1,
                        revealToBoth: 1,
                        requiresProposerReview: 1,
                        requiresBidderReview: 1,
                      },
                    },
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

        resolve({ postedBids: [...openBids, ...allOtherBids] });
      } catch (e) {
        reject(e);
      }
    });
  },

  getAwardedBidDetails: async (mongoUser_id, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById({ _id: mongoUser_id }, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            populate: [
              {
                path: '_jobRef',
                populate: [
                  {
                    path: '_reviewRef',
                    select: {
                      proposerReview: 1,
                      bidderReview: 1,
                      revealToBoth: 1,
                      requiresProposerReview: 1,
                      requiresBidderReview: 1,
                    },
                  },
                  {
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
                  {
                    path: '_awardedBidRef',
                    select: { _bidderRef: 1 },
                    populate: { path: '_bidderRef', select: { userId: 1 } },
                  },
                ],
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

  // get jobs for a user and filter by a given state
  getBidDetails: async (mongoUser_id, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById(mongoUser_id, { _postedBidsRef: 1 })
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
                templateId: 1,
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
    const isSuccessful = await BidModel.findByIdAndUpdate(bidId, {
      $set: { isNewBid: false },
    })
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
  updateBidValue: ({ mongoUser_id, bidId, bidAmount }) => {
    return BidModel.findOneAndUpdate(
      { _id: bidId, _bidderRef: mongoUser_id },
      {
        $set: { 'bidAmount.value': bidAmount, isNewBid: true },
      },
      { new: true }
    )
      .lean(true)
      .exec();
  },
  postNewBid: ({ mongoUser_id, jobId, bidAmount }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newBid = await new BidModel({
          _bidderRef: mongoUser_id,
          _jobRef: jobId,
          bidAmount: { value: bidAmount, currency: bidAmount.currency || 'CAD' },
        }).save();

        //update the user and job model with this new bid
        const updateRelativeModels = await Promise.all([
          UserModel.findOneAndUpdate(
            { _id: mongoUser_id },
            {
              $push: { _postedBidsRef: newBid._id },
            }
          )
            .lean(true)
            .exec(),
          JobModel.updateOne(
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
            utils.jobTemplateIdToDefinitionObjectMapper[`${jobDetails.templateId}`];
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
