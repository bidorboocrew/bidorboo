//handle all user data manipulations
const mongoose = require('mongoose');
const moment = require('moment');
const UserModel = mongoose.model('UserModel');
const RequestModel = mongoose.model('RequestModel');
const BidModel = mongoose.model('BidModel');
const ROUTES = require('../backend-route-constants');
const utils = require('../utils/utilities');
const stripeServiceUtil = require('../services/stripeService').util;
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const { getChargeDistributionDetails } = require('../utils/chargesCalculatorUtil');
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;
exports.bidDataAccess = {
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
     *        Update status to have taskers
     *
     * - push notify to both informing them of this change
     * especially the case of not past due emphasizethat user can
     * select a new tasker
     *
     */
    return new Promise(async (resolve, reject) => {
      try {
        const bidDetails = await BidModel.findOne({
          _taskerRef: mongoUser_id,
          _id: bidId,
        })
          .populate([
            {
              path: '_taskerRef',
              select: {
                rating: 1,
                _id: 1,
              },
            },
            {
              path: '_requestRef',
              select: { _id: 1, _ownerRef: 1, startingDateAndTime: 1, processedPayment: 1 },
            },
          ])
          .lean(true)
          .exec();

        const requesterId = bidDetails._requestRef._ownerRef;
        const paymentDetails = bidDetails._requestRef.processedPayment;

        const requestedRequestId = bidDetails._requestRef._id;
        const taskerId = bidDetails._taskerRef;
        const taskerRating = bidDetails._taskerRef.rating;
        const {
          requesterDisplayName,
          taskerDisplayName,
          requestDisplayName,
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
        } = await exports.bidDataAccess._getAwardedRequestOwnerTaskerAndRelevantNotificationDetails(
          requestedRequestId
        );

        const currentRating = taskerRating.globalRating;
        const desiredRatingAfterPenalty = Math.max(currentRating - 0.25, 0).toFixed(2);
        const newTotalOfAllTimesBeenRated = taskerRating.numberOfTimesBeenRated + 1;

        const theNewTotalOfAllRating = newTotalOfAllTimesBeenRated * desiredRatingAfterPenalty;

        // xxx critical
        const refundCharge = await stripeServiceUtil.fullRefundTransaction({
          ...paymentDetails,
          metadata: {
            requesterId: requesterId.toString(),
            requesterEmailAddress,
            taskerId: taskerId.toString(),
            taskerEmailAddress,
            requestedRequestId: requestedRequestId.toString(),
            awardedBidId: bidDetails._id.toString(),
            note: 'Tasker cancelled an awarded request',
          },
        });

        if (refundCharge.status === 'succeeded') {
          const [updatedRequest, updatedBid, updatedTasker] = await Promise.all([
            RequestModel.findOneAndUpdate(
              { _id: requestedRequestId, _ownerRef: requesterId },
              {
                $set: {
                  state: 'AWARDED_REQUEST_CANCELED_BY_TASKER',
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

            UserModel.findByIdAndUpdate(
              taskerId,
              {
                $set: {
                  'rating.latestComment':
                    'BidOrBoo Auto Review: Cancelled Their Request After booking was confirmed with the requester',
                  'rating.globalRating': desiredRatingAfterPenalty,
                  'rating.numberOfTimesBeenRated': newTotalOfAllTimesBeenRated,
                  'rating.totalOfAllRatings': theNewTotalOfAllRating,
                },
                $push: {
                  'rating.canceledBids': bidId,
                },
              },
              { new: true }
            )
              .lean(true)
              .exec(),
          ]);

          if (allowedToEmailRequester) {
            // send communication to both about the cancellation
            sendGridEmailing.tellRequeterThatTheTaskerHaveCancelledAnAwardedRequest({
              to: requesterEmailAddress,
              requestTitle: requestDisplayName,
              toDisplayName: requesterDisplayName,
              linkForOwner: requestLinkForRequester,
            });
          }
          if (allowedToEmailTasker) {
            sendGridEmailing.tellTaskerThatTheyCancelledRequest({
              to: taskerEmailAddress,
              requestTitle: requestDisplayName,
              toDisplayName: taskerDisplayName,
              linkForTasker: requestLinkForTasker,
            });
          }

          if (allowedToTextRequester) {
            sendTextService.sendRequestIsCancelledText(
              requesterPhoneNumber,
              requestDisplayName,
              requestLinkForRequester
            );
          }
          if (allowedToTextTasker) {
            sendTextService.sendRequestIsCancelledText(
              taskerPhoneNumber,
              requestDisplayName,
              requestLinkForTasker
            );
          }

          if (allowedToPushNotifyRequester) {
            WebPushNotifications.pushAwardedRequestWasCancelled(requesterPushNotSubscription, {
              requestTitle: requestDisplayName,
              urlToLaunch: requestLinkForRequester,
            });
          }
          if (allowedToPushNotifyTasker) {
            WebPushNotifications.pushAwardedRequestWasCancelled(taskerPushNotSubscription, {
              requestTitle: requestLinkForRequester,
              urlToLaunch: requestLinkForTasker,
            });
          }
          // -------------notify

          // -------------------------------- assert things sxxxxx
          return resolve({ success: true, bidId });
        } else {
          return reject({
            refund: refundCharge,
            errorMsg: 'refund status failed we will get in touch with you shortly',
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  },

  _getAwardedRequestOwnerTaskerAndRelevantNotificationDetails: async (requestId) => {
    const awardedRequest = await RequestModel.findById(requestId)
      .populate({
        path: '_awardedBidRef',
        select: {
          _taskerRef: 1,
          isNewBid: 1,
          bidAmount: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        populate: {
          path: '_taskerRef',
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
      .lean(true)
      .exec();

    const { _ownerRef, _awardedBidRef, processedPayment } = awardedRequest;
    const awardedBidId = _awardedBidRef._id.toString();
    const requestedRequestId = awardedRequest._id.toString();

    const ownerDetails = _ownerRef;
    const awardedTaskerDetails = _awardedBidRef._taskerRef;

    const requesterId = _ownerRef._id.toString();
    const taskerId = awardedTaskerDetails._id.toString();

    const requesterDisplayName = ownerDetails.displayName;
    const taskerDisplayName = awardedTaskerDetails.displayName;
    const requestDisplayName = `${awardedRequest.requestTemplateDisplayTitle} - ${awardedRequest.requestTitle}`;

    const requestLinkForRequester = ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(
      requestId
    );
    const requestLinkForTasker = ROUTES.CLIENT.TASKER.dynamicCurrentAwardedBid(awardedBidId);

    const requesterPushNotSubscription = ownerDetails.pushSubscription;
    const taskerPushNotSubscription = awardedTaskerDetails.pushSubscription;

    const requesterEmailAddress =
      ownerDetails.email && ownerDetails.email.emailAddress ? ownerDetails.email.emailAddress : '';
    const requesterPhoneNumber =
      ownerDetails.phone && ownerDetails.phone.phoneNumber ? ownerDetails.phone.phoneNumber : '';

    const taskerEmailAddress =
      awardedTaskerDetails.email && awardedTaskerDetails.email.emailAddress
        ? awardedTaskerDetails.email.emailAddress
        : '';
    const taskerPhoneNumber =
      awardedTaskerDetails.phone && awardedTaskerDetails.phone.phoneNumber
        ? awardedTaskerDetails.phone.phoneNumber
        : '';

    const allowedToEmailRequester = ownerDetails.notifications && ownerDetails.notifications.email;
    const allowedToEmailTasker =
      awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.email;

    const allowedToTextRequester = ownerDetails.notifications && ownerDetails.notifications.text;
    const allowedToTextTasker =
      awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.text;

    const allowedToPushNotifyRequester =
      ownerDetails.notifications && ownerDetails.notifications.push;
    const allowedToPushNotifyTasker =
      awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.push;

    return {
      requestedRequestId,
      awardedBidId,
      requesterId,
      taskerId,
      requesterDisplayName,
      taskerDisplayName,
      requestDisplayName,
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
            path: '_requestRef',
            select: {
              _id: 1,
            },
          })
          .lean(true)
          .exec();
        if (!bidDetails || !bidDetails._requestRef || !bidDetails._requestRef._id) {
          reject('Error while deleting bid, Bid reference Not Found.');
        } else {
          await Promise.all([
            RequestModel.findOneAndUpdate(
              { _id: bidDetails._requestRef._id },
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
  getBidById: (bidId, withVirtuals = false) => {
    return BidModel.findById(bidId)
      .populate({
        path: '_taskerRef',
        select: {
          notifications: 1,
          _asTaskerReviewsRef: 1,
          _asRequesterReviewsRef: 1,
          rating: 1,
          userId: 1,
          displayName: 1,
          profileImage: 1,
          personalParagraph: 1,
          membershipStatus: 1,
          createdAt: 1,
          email: 1,
          tos_acceptance: 1,
        },
      })
      .populate({
        path: '_requestRef',
        select: {
          _ownerRef: 1,
          title: 1,
          state: 1,
          detailedDescription: 1,
          requestTitle: 1,
          location: 1,
          stats: 1,
          addressText: 1,
          startingDateAndTime: 1,
          durationOfRequest: 1,
          templateId: 1,
          reported: 1,
          createdAt: 1,
          updatedAt: 1,
          completionDate: 1,
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
      .lean(withVirtuals ? { virtuals: true } : true)
      .exec();
  },
  getBidByIdWithTaskerDetails: (bidId) => {
    return BidModel.findById(bidId)
      .populate({
        path: '_taskerRef',
      })
      .populate({
        path: '_requestRef',
      })
      .lean({ virtuals: true })
      .exec();
  },
  // get requests for a user and filter by a given state
  getMyPostedBidsSummary: async (mongoUser_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { _postedBidsRef } = await UserModel.findById(mongoUser_id, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            select: {
              requesterPayment: 0,
              requesterPartialRefund: 0,
            },
            populate: {
              path: '_requestRef',
              select: {
                _awardedBidRef: 1,
                state: 1,
                requestTitle: 1,
                startingDateAndTime: 1,
                templateId: 1,
                taskerConfirmedCompletion: 1,
                'dispute.taskerDispute': 1,
                'dispute.bidOrBooCrewResolution.taskerResolution': 1,
                _reviewRef: 1,
                taskImages: 1,
                completionDate: 1,
              },
              populate: [
                {
                  path: '_reviewRef',
                },
                {
                  path: '_awardedBidRef',
                  select: {
                    _taskerRef: 1,
                  },
                },
              ],
            },
          })
          .lean({ virtuals: true })
          .exec();

        let results = [];
        if (_postedBidsRef && _postedBidsRef.length > 0) {
          results = _postedBidsRef
            .sort((a, b) => {
              return moment(a._requestRef.startingDateAndTime).isSameOrAfter(
                moment(b._requestRef.startingDateAndTime)
              )
                ? 1
                : -1;
            })
            .map((postedBid) => {
              const requestRef = postedBid._requestRef;
              if (
                requestRef._awardedBidRef &&
                requestRef._awardedBidRef._taskerRef.toString() === mongoUser_id.toString()
              ) {
                postedBid.isAwardedToMe = true;
              } else {
                postedBid.isAwardedToMe = false;
                requestRef._awardedBidRef = {};
              }

              if (['DONE', 'DONE_SEEN'].includes(requestRef.state)) {
                const reviewRef = requestRef._reviewRef;

                const revealToBoth = !!(
                  reviewRef &&
                  reviewRef.requesterReview &&
                  reviewRef.taskerReview
                );

                const requiresRequesterReview =
                  !reviewRef || (reviewRef && !reviewRef.requesterReview);

                const requiresTaskerReview = !reviewRef || (reviewRef && !reviewRef.taskerReview);
                requestRef._reviewRef = {
                  revealToBoth,
                  requiresRequesterReview,
                  requiresTaskerReview,
                };
              }
              return postedBid;
            });
        }
        resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  },
  getAwardedBidDetailsForTasker: async (mongoUser_id, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findOne({ _id: mongoUser_id }, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            select: {
              _id: 1,
              bidAmount: 1,
              taskerPayout: 1,
              taskerPartialPayout: 1,
              taskerActualPayoutInBank: 1,
            },
            populate: [
              {
                path: '_requestRef',
                select: {
                  _bidsListRef: 0,
                  hideFrom: 0,
                  viewedBy: 0,
                  latestCheckoutSession: 0,
                  processedPayment: 0,
                  'dispute.requesterDispute': 0,
                  'dispute.bidOrBooCrewResolution.requesterResolution': 0,
                },
                populate: [
                  {
                    path: '_reviewRef',
                    select: {
                      requesterReview: 1,
                      taskerReview: 1,
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
                    select: { _taskerRef: 1 },
                    populate: { path: '_taskerRef', select: { userId: 1 } },
                  },
                ],
              },
              {
                path: '_taskerRef',
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
          .lean(true)
          .exec();

        const theBid =
          user && user._postedBidsRef && user._postedBidsRef.length === 1
            ? user._postedBidsRef[0]
            : {};

        if (
          theBid &&
          (theBid._requestRef.state === 'AWARDED' || theBid._requestRef.state === 'AWARDED_SEEN')
        ) {
          if (
            theBid._requestRef._awardedBidRef._taskerRef._id.toString() === mongoUser_id.toString()
          ) {
            theBid.isAwardedToMe = true;
          } else {
            // you are not the awarded bidder
            return resolve({});
          }
        }

        if (['DONE', 'DONE_SEEN', 'AWARDED', 'AWARDED_SEEN'].includes(theBid._requestRef.state)) {
          const reviewRef = theBid._requestRef._reviewRef;

          const revealToBoth = !!(reviewRef && reviewRef.requesterReview && reviewRef.taskerReview);

          const requiresRequesterReview = !reviewRef || (reviewRef && !reviewRef.requesterReview);

          const requiresTaskerReview = !reviewRef || (reviewRef && !reviewRef.taskerReview);
          theBid._requestRef._reviewRef = {
            revealToBoth,
            requiresRequesterReview,
            requiresTaskerReview,
          };
        }

        return resolve(theBid);
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
            select: {
              _id: 1,
              bidAmount: 1,
              taskerPayout: 1,
              taskerPartialPayout: 1,
              taskerActualPayoutInBank: 1,
            },
            populate: [
              {
                path: '_requestRef',
                populate: [
                  {
                    path: '_reviewRef',
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
                    select: { _taskerRef: 1 },
                    populate: { path: '_taskerRef', select: { userId: 1 } },
                  },
                ],
              },
              {
                path: '_taskerRef',
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

  // get requests for a user and filter by a given state
  getBidDetails: async (mongoUser_id, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserModel.findById(mongoUser_id, { _postedBidsRef: 1 })
          .populate({
            path: '_postedBidsRef',
            match: { _id: { $eq: bidId } },
            populate: {
              path: '_requestRef',
              select: {
                _ownerRef: 1,
                state: 1,
                detailedDescription: 1,
                requestTitle: 1,
                location: 1,
                stats: 1,
                startingDateAndTime: 1,
                durationOfRequest: 1,
                templateId: 1,
                extras: 1,
                completionDate: 1,
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

  updateBidValue: ({ mongoUser_id, bidId, bidAmount }) => {
    const {
      requesterPaymentAmount,
      taskerPayoutAmount,
      requesterPartialRefundAmount,
      taskerPartialPayoutAmount,
      taskerActualPayoutInBank,
    } = getChargeDistributionDetails(bidAmount);

    return BidModel.findOneAndUpdate(
      { _id: bidId, _taskerRef: mongoUser_id },
      {
        $set: {
          'bidAmount.value': bidAmount,
          isNewBid: true,
          'requesterPayment.value': requesterPaymentAmount,
          'taskerPayout.value': taskerPayoutAmount,
          'taskerPartialPayout.value': taskerPartialPayoutAmount,
          'requesterPartialRefund.value': requesterPartialRefundAmount,
          'taskerActualPayoutInBank.value': taskerActualPayoutInBank,
        },
      },
      { new: true }
    )
      .lean(true)
      .exec();
  },
  postNewBid: ({ mongoUser_id, requestId, bidAmount }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          requesterPaymentAmount,
          taskerPayoutAmount,
          requesterPartialRefundAmount,
          taskerPartialPayoutAmount,
          taskerActualPayoutInBank,
        } = getChargeDistributionDetails(bidAmount);

        const newBid = await new BidModel({
          _taskerRef: mongoUser_id,
          _requestRef: requestId,
          bidAmount: { value: bidAmount, currency: bidAmount.currency || 'CAD' },
          requesterPayment: {
            value: requesterPaymentAmount,
            currency: bidAmount.currency || 'CAD',
          },
          requesterPartialRefund: {
            value: requesterPartialRefundAmount,
            currency: bidAmount.currency || 'CAD',
          },
          taskerPayout: {
            value: taskerPayoutAmount,
            currency: bidAmount.currency || 'CAD',
          },
          taskerPartialPayout: {
            value: taskerPartialPayoutAmount,
            currency: bidAmount.currency || 'CAD',
          },
          taskerActualPayoutInBank: {
            value: taskerActualPayoutInBank,
            currency: bidAmount.currency || 'CAD',
          },
        }).save();

        //update the user and request model with this new bid
        await Promise.all([
          UserModel.findOneAndUpdate(
            { _id: mongoUser_id },
            {
              $push: { _postedBidsRef: newBid._id },
            }
          )
            .lean(true)
            .exec(),
          RequestModel.updateOne(
            { _id: requestId },
            {
              $push: { _bidsListRef: newBid._id },
            }
          )
            .lean(true)
            .exec(),
        ]);

        const requestDetails = await RequestModel.findById(requestId)
          .populate({
            path: '_ownerRef',
            select: {
              _id: 1,
              displayName: 1,
              email: 1,
              phone: 1,
              _taskerRef: 1,
              pushSubscription: 1,
              notifications: 1,
            },
          })
          .lean()
          .exec();
        const ownerDetails = requestDetails._ownerRef;
        const notificationSettings = requestDetails.notifications;
        if (ownerDetails && notificationSettings) {
          const ownerEmailAddress =
            ownerDetails.email && ownerDetails.email.emailAddress
              ? ownerDetails.email.emailAddress
              : '';

          const requestTemplate =
            utils.requestTemplateIdToDefinitionObjectMapper[`${requestDetails.templateId}`];
          const requestTitle = `${requestTemplate.TITLE} - ${requestDetails.requestTitle}`;
          ownerEmailAddress &&
            notificationSettings.email &&
            sendGridEmailing.sendNewBidRecievedEmail({
              to: ownerEmailAddress,
              toDisplayName: ownerDetails.displayName,
              taskName: requestTitle,
              clickLink: `${ROUTES.CLIENT.REQUESTER.dynamicReviewRequestAndBidsPage(requestId)}`,
            });

          const ownerPushSubscription = ownerDetails.pushSubscription
            ? ownerDetails.pushSubscription
            : '';
          ownerPushSubscription &&
            notificationSettings.push &&
            WebPushNotifications.pushNewBidRecieved(ownerPushSubscription, {
              requestTitle: requestTitle,
              urlToLaunch: `${ROUTES.CLIENT.REQUESTER.dynamicReviewRequestAndBidsPage(requestId)}`,
            });
        }

        newBid && newBid.toObject ? resolve(newBid.toObject()) : resolve(newBid);
      } catch (e) {
        reject(e);
      }
    });
  },

  getAchivedBidDetailsForTasker: ({ mongoUser_id, bidId }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const archivedBidDetails = await BidModel.findOne(
          {
            _id: bidId,
            _taskerRef: mongoUser_id,
          },
          { requesterPayment: 0, requesterPartialRefund: 0, addressText: 0 }
        )
          .populate({
            path: '_requestRef',
            select: { processedPayment: 0, payoutDetails: 0 },
            populate: [
              {
                path: '_ownerRef',
                select: {
                  displayName: 1,
                  profileImage: 1,
                  rating: 1,
                  membershipStatus: 1,
                },
              },
              {
                path: '_awardedBidRef',
                select: {
                  _taskerRef: 1,
                  isNewBid: 1,
                  requesterPayment: 1,
                  requesterPartialRefund: 1,
                },
                populate: {
                  path: '_taskerRef',
                  select: {
                    displayName: 1,
                    profileImage: 1,
                    rating: 1,
                    membershipStatus: 1,
                  },
                },
              },
              {
                path: '_reviewRef',
              },
              {
                path: '_ownerRef',
                select: {
                  displayName: 1,
                  email: 1,
                  phone: 1,
                  profileImage: 1,
                  rating: 1,
                },
              },
            ],
          })
          .lean()
          .exec();

        if (archivedBidDetails && archivedBidDetails._id) {
          const requestDetails = archivedBidDetails._requestRef;
          if (
            requestDetails._reviewRef &&
            !(requestDetails._reviewRef.requesterReview && requestDetails._reviewRef.taskerReview)
          ) {
            requestDetails._reviewRef.requesterReview = null;
          }
          return resolve(archivedBidDetails);
        }
        reject('cant find the specified Bid');
      } catch (e) {
        reject(e);
      }
    });
  },

  findBidByOwner: async (mongoUser_id, bidId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const theBid = await BidModel.findOne({ _taskerRef: mongoUser_id, _id: bidId })
          .lean(true)
          .exec();

        resolve(theBid);
      } catch (e) {
        reject(e);
      }
    });
  },
  confirm: (mongoUser_id, bidId) => {
    return BidModel.findOne({ _id: bidId }, { _awardedBidRef: 1 })
      .populate({
        path: '_awardedBidRef',
        select: {
          _taskerRef: 1,
        },
        populate: {
          path: '_taskerRef',
          match: { _id: mongoUser_id },
          select: { _id: 1 },
        },
      })
      .lean()
      .exec();
  },
};
