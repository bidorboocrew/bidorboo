//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const RequestModel = mongoose.model('RequestModel');
const BidModel = mongoose.model('BidModel');
const ReviewModel = mongoose.model('ReviewModel');

const moment = require('moment');
const ROUTES = require('../backend-route-constants');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const stripeServiceUtil = require('../services/stripeService').util;

const BIDORBOO_REQUESTER_REFUND_PERCENTAGE_IN_CASE_OF_CANCELLATION = 0.9;

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedRequestOwnerTaskerAndRelevantNotificationDetails;
const templateIdToDisplayName = {
  bdbHouseCleaning: 'House Cleaning',
  bdbCarDetailing: 'Car Detailing',
  bdbPetSittingWalking: 'Pet Sitting/Walking',
  bdbMoving: 'Moving/Lifting Helpers',
};
exports.requestDataAccess = {
  BidOrBooAdmin: {
    SendRemindersForUpcomingRequests: async () => {
      try {
        const requests = await RequestModel.find({
          $and: [
            { _awardedBidRef: { $exists: true } },
            { state: { $in: ['AWARDED', 'AWARDED_SEEN'] } },
          ],
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
          .populate({
            path: '_awardedBidRef',
            select: { _taskerRef: 1 },
            populate: {
              path: '_taskerRef',
              select: {
                _id: 1,
                displayName: 1,
                email: 1,
                phone: 1,
                pushSubscription: 1,
                notifications: 1,
              },
            },
          })
          .lean({ virtuals: true })
          .exec();

        if (requests && requests.length > 0) {
          requests.forEach(async (request) => {
            try {
              const { isHappeningSoon } = request;

              if (isHappeningSoon) {
                const requestId = request._id.toString();
                const awardedBidId = request._awardedBidRef._id.toString();
                const ownerDetails = request._ownerRef;
                const ownerEmailAddress =
                  ownerDetails.email && ownerDetails.email.emailAddress
                    ? ownerDetails.email.emailAddress
                    : '';
                const ownerPhoneNumber =
                  ownerDetails.phone && ownerDetails.phone.phoneNumber
                    ? ownerDetails.phone.phoneNumber
                    : '';
                const linkForOwner = ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(
                  requestId
                );
                const awardedTaskerDetails = request._awardedBidRef._taskerRef;
                const taskerEmailAddress =
                  awardedTaskerDetails.email && awardedTaskerDetails.email.emailAddress
                    ? awardedTaskerDetails.email.emailAddress
                    : '';
                const taskerPhoneNumber =
                  awardedTaskerDetails.phone && awardedTaskerDetails.phone.phoneNumber
                    ? awardedTaskerDetails.phone.phoneNumber
                    : '';
                const linkForTasker = ROUTES.CLIENT.TASKER.dynamicCurrentAwardedBid(awardedBidId);
                if (ownerDetails.notifications && ownerDetails.notifications.email) {
                  sendGridEmailing.sendRequestIsHappeningSoonToRequesterEmail({
                    to: ownerEmailAddress,
                    requestTitle: request.templateId,
                    toDisplayName: `${ownerDetails.displayName}`,
                    taskerEmailAddress,
                    taskerPhoneNumber,
                    linkForOwner,
                  });
                }
                if (
                  awardedTaskerDetails.notifications &&
                  awardedTaskerDetails.notifications.email
                ) {
                  sendGridEmailing.sendRequestIsHappeningSoonToTaskerEmail({
                    to: taskerEmailAddress,
                    requestTitle: request.templateId,
                    toDisplayName: `${awardedTaskerDetails.displayName}`,
                    ownerEmailAddress,
                    ownerPhoneNumber,
                    linkForTasker,
                  });
                }

                if (
                  ownerPhoneNumber &&
                  ownerDetails.notifications &&
                  ownerDetails.notifications.text
                ) {
                  sendTextService.sendRequestIsHappeningSoonText(
                    ownerPhoneNumber,
                    request.templateId,
                    linkForOwner
                  );
                }
                if (
                  taskerPhoneNumber &&
                  awardedTaskerDetails.notifications &&
                  awardedTaskerDetails.notifications.text
                ) {
                  sendTextService.sendRequestIsHappeningSoonText(
                    taskerPhoneNumber,
                    request.templateId,
                    linkForTasker
                  );
                }

                if (ownerDetails.notifications && ownerDetails.notifications.push) {
                  WebPushNotifications.pushRequestIsHappeningSoon(ownerDetails.pushSubscription, {
                    requestTitle: request.templateId,
                    urlToLaunch: linkForOwner,
                  });
                }
                if (awardedTaskerDetails.notifications && awardedTaskerDetails.notifications.push) {
                  WebPushNotifications.pushRequestIsHappeningSoon(
                    awardedTaskerDetails.pushSubscription,
                    {
                      requestTitle: request.templateId,
                      urlToLaunch: linkForTasker,
                    }
                  );
                }
              }
            } catch (innerE) {
              console.log('BIDORBOO_ERROR: SendRemindersForUpcomingRequests_Error ' + innerE);
            }
          });
        }
      } catch (e) {
        console.log('BIDORBOO_ERROR: SendRemindersForUpcomingRequests_Error ' + e);
      }
    },
    CleanUpAllExpiredNonAwardedRequests: async () => {
      try {
        const requests = await RequestModel.find({
          startingDateAndTime: { $exists: true },
          _awardedBidRef: { $exists: false },
        })
          .populate({
            path: '_bidsListRef',
            select: { _id: 1, _taskerRef: 1 },
            populate: {
              path: '_taskerRef',
            },
          })
          .lean({ virtuals: true })
          .exec();

        if (requests && requests.length > 0) {
          requests.forEach((request) => {
            try {
              console.log(
                `BIDORBOO_LOGGING === deleting request ${requestId} which was planned for ${startingDateAndTime}`
              );
              const { _id: requestId, isPastDue, startingDateAndTime } = request;

              if (isPastDue) {
                request.remove().catch((deleteError) => {
                  console.log('BIDORBOO_ERROR: CleanUpAllExpiredNonAwardedRequests ' + deleteError);
                });
              }
            } catch (innerError) {
              console.log('BIDORBOO_ERROR: CleanUpAllExpiredNonAwardedRequests ' + innerError);
            }
          });
        }

        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: CleanUpAllExpiredNonAwardedRequests_Error ' + e);
      }
    },
    nagRequesterToConfirmRequest: async () => {
      try {
        const requests = await RequestModel.find({
          state: { $in: ['AWARDED', 'AWARDED_SEEN'] },
          dispute: { $exists: false },
          taskerConfirmedCompletion: { $eq: true },
          _awardedBidRef: { $exists: true },
        })
          .lean(true)
          .exec();

        const threeDaysAgo = moment.utc().subtract(3, 'days');

        if (requests && requests.length > 0) {
          requests.forEach(async (request) => {
            try {
              const requestStartDate = request.startingDateAndTime;
              const markAsDoneAnyways = moment(requestStartDate).isBefore(threeDaysAgo);

              const {
                requesterDisplayName,
                requestDisplayName,
                requestLinkForRequester,
                requesterEmailAddress,
                requesterPhoneNumber,
                allowedToEmailRequester,
                allowedToTextRequester,
                allowedToPushNotifyRequester,
                requesterPushNotSubscription,
              } = await getAllContactDetails(request._id);

              if (markAsDoneAnyways) {
                console.log('-------AUTO MARK REQUEST DONE----------------------');
                console.log(request._id);

                await RequestModel.findOneAndUpdate(
                  { _id: request._id },
                  {
                    $set: {
                      state: 'DONE',
                    },
                  }
                )
                  .lean(true)
                  .exec();
                console.log('-------AUTO MARK REQUEST DONE----------------------');
                if (allowedToEmailRequester) {
                  console.log(
                    'sensendGridEmailingdTextService.tellRequesterThatWeMarkedRequestDone'
                  );
                  console.log({
                    to: requesterEmailAddress,
                    requestTitle: requestDisplayName,
                    toDisplayName: requesterDisplayName,
                    linkForOwner: requestLinkForRequester,
                  });
                  sendGridEmailing.tellRequesterThatWeMarkedRequestDone({
                    to: requesterEmailAddress,
                    requestTitle: requestDisplayName,
                    toDisplayName: requesterDisplayName,
                    linkForOwner: requestLinkForRequester,
                  });
                }

                if (allowedToTextRequester) {
                  console.log('sendTextService.tellRequesterThatWeMarkedRequestDone');
                  console.log({
                    requesterPhoneNumber,
                    requestDisplayName,
                    requestLinkForRequester,
                  });
                  sendTextService.tellRequesterThatWeMarkedRequestDone(
                    requesterPhoneNumber,
                    requestDisplayName,
                    requestLinkForRequester
                  );
                }

                if (allowedToPushNotifyRequester) {
                  console.log('WebPushNotifications.tellRequesterToConfirmRequest');
                  console.log({
                    requestTitle: requestDisplayName,
                    urlToLaunch: requestLinkForRequester,
                  });

                  WebPushNotifications.tellRequesterToConfirmRequest(requesterPushNotSubscription, {
                    requestTitle: requestDisplayName,
                    urlToLaunch: requestLinkForRequester,
                  });
                }
              } else {
                if (allowedToEmailRequester) {
                  console.log('sensendGridEmailingdTextService.tellRequesterToConfirmRequest');
                  console.log({
                    to: requesterEmailAddress,
                    requestTitle: requestDisplayName,
                    toDisplayName: requesterDisplayName,
                    linkForOwner: requestLinkForRequester,
                  });
                  sendGridEmailing.tellRequesterToConfirmRequest({
                    to: requesterEmailAddress,
                    requestTitle: requestDisplayName,
                    toDisplayName: requesterDisplayName,
                    linkForOwner: requestLinkForRequester,
                  });
                }

                if (allowedToTextRequester) {
                  console.log('sendTextService.tellRequesterToConfirmRequest');
                  console.log({
                    requesterPhoneNumber,
                    requestDisplayName,
                    requestLinkForRequester,
                  });
                  sendTextService.tellRequesterToConfirmRequest(
                    requesterPhoneNumber,
                    requestDisplayName,
                    requestLinkForRequester
                  );
                }

                if (allowedToPushNotifyRequester) {
                  console.log('WebPushNotifications.tellRequesterToConfirmRequest');
                  console.log({
                    requestTitle: requestDisplayName,
                    urlToLaunch: requestLinkForRequester,
                  });

                  WebPushNotifications.tellRequesterToConfirmRequest(requesterPushNotSubscription, {
                    requestTitle: requestDisplayName,
                    urlToLaunch: requestLinkForRequester,
                  });
                }
              }
            } catch (innerError) {
              console.log('BIDORBOO_ERROR: nagRequesterToConfirmRequest_Error ' + innerError);
            }
          });
        }
        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: nagRequesterToConfirmRequest_Error ' + e);
      }
    },
    SendPayoutsToBanks: async () => {
      try {
        // find all requests that are done and does not have payment to bank on the way

        const requests = RequestModel.find({
          _awardedBidRef: { $exists: true },
          processedPayment: { $exists: true },
          state: {
            $in: [
              'DONE',
              'DONE_SEEN',
              'ARCHIVE',
              'AWARDED_REQUEST_CANCELED_BY_REQUESTER',
              'AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN',
              'ARCHIVE',
            ],
          },
          paymentToBank: { $exists: false },
        })
          .lean(true)
          .exec();

        if (requests && requests.length > 0) {
          requests.forEach(async (request) => {
            try {
              const { _id: requestId, processedPayment } = request;
              const {
                amount,
                applicationFeeAmount,
                destinationStripeAcc,
                paymentIntentId,
                refund,
              } = processedPayment;

              const taskerConnectAccDetails = await stripeServiceUtil.getConnectedAccountDetails(
                destinationStripeAcc
              );

              // confirm payouts enabled
              if (taskerConnectAccDetails && taskerConnectAccDetails.payouts_enabled) {
                let taskerPayout = 0;
                if (refund && refund.status === 'succeeded') {
                  const ratioOfRefund = refund.amount / amount;
                  const amountRefundedFromApplicationFee = ratioOfRefund * applicationFeeAmount;
                  const actualKeptBidOrBooApplicationFees =
                    applicationFeeAmount - amountRefundedFromApplicationFee;

                  taskerPayout = Math.floor(
                    amount - refund.amount - actualKeptBidOrBooApplicationFees
                  );
                } else if (refund && refund.status !== 'succeeded') {
                  console.log(
                    'BIDORBOO_PAYMENTS: DANGER INVESTIGATE WHY THIS IS NOT SUCCESSFUL' +
                      JSON.stringify(request)
                  );
                  return;
                }
                if (!refund) {
                  taskerPayout = Math.floor(amount - applicationFeeAmount);
                }

                let payoutInititated = null;
                try {
                  payoutInititated = await stripeServiceUtil.payoutToBank(destinationStripeAcc, {
                    amount: taskerPayout,
                    metadata: {
                      paymentIntentId,
                      requestId: requestId.toString(),
                      destinationStripeAcc,
                      note: 'Released Payout to Tasker',
                    },
                  });

                  const { id: payoutId, status } = payoutInititated;
                  // update request with the payment details
                  await RequestModel.findOneAndUpdate(
                    { _id: requestId },
                    {
                      $set: {
                        payoutDetails: {
                          id: payoutId,
                          status,
                        },
                      },
                    }
                  )
                    .lean()
                    .exec();
                } catch (errorPayout) {
                  if (errorPayout) {
                    console.log(
                      'BIDORBOO_ERROR: SendPayoutsToBanks_Error ' +
                        errorPayout +
                        '  ' +
                        errorPayout.message
                    );
                  } else {
                    console.log('BIDORBOO_ERROR: SendPayoutsToBanks_Error ' + errorPayout);
                  }
                }
              } else {
                console.log(
                  'BIDORBOO_PAYMENTS: DANGER PAYOUT IS NOT ENABLED PLEASE INVESTIGATE WHY ' +
                    destinationStripeAcc
                );
              }
            } catch (innerError) {
              throw innerError;
            }
          });
        }
        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: SendPayoutsToBanks_Error ' + e);
      }
    },

    CleanUpAllBidsAssociatedWithDoneRequests: async () => {
      try {
        const requests = RequestModel.find({
          _awardedBidRef: { $exists: true },
          state: { $eq: 'ARCHIVE' },
        })
          .populate({
            path: '_bidsListRef',
            select: { _id: 1, _taskerRef: 1 },
            populate: {
              path: '_taskerRef',
            },
          })
          .lean(true)
          .exec();

        if (requests && requests.length > 0) {
          requests.forEach((request) => {
            try {
              const areThereAnyBids = request._bidsListRef && request._bidsListRef.length > 0;
              if (areThereAnyBids) {
                bidsIds = [];
                taskersIds = [];
                const awardedBidRefId = request._awardedBidRef._id.toString();

                request._bidsListRef.forEach((bidRef) => {
                  // dont delete the awardedBidRef
                  if (bidRef._id.toString() !== awardedBidRefId.toString()) {
                    bidsIds.push(bidRef._id.toString());
                    taskersIds.push(bidRef._taskerRef._id.toString());
                  }
                });

                taskersIds.forEach((taskerId) => {
                  // clean ref for taskers
                  User.findOneAndUpdate(
                    { _id: taskerId },
                    { $pull: { _postedBidsRef: { $in: bidsIds } } }
                  )
                    .exec()
                    .catch((fail) =>
                      console.log(
                        'BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneRequests User.findOneAndUpdate ' +
                          JSON.stringify(fail)
                      )
                    );
                });

                // clean the bids for taskers
                bidsIds.forEach((bidId) => {
                  BidModel.deleteOne({ _id: bidId })
                    .exec()
                    .catch((fail2) =>
                      console.log(
                        'BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneRequests BidModel.deleteOne ' +
                          JSON.stringify(fail2)
                      )
                    );
                });
              }
            } catch (innerError) {
              console.log(
                'BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneRequests ' +
                  JSON.stringify(innerError)
              );
            }
          });
        }
        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneRequests ' + e);
      }
    },
  },

  getRequestById: (requestId) => {
    return RequestModel.findById(requestId)
      .lean(true)
      .exec();
  },
  getBidsList: (requestId) => {
    return RequestModel.findById(requestId)
      .populate({ path: '_bidsListRef', select: { _taskerRef: 1 } })
      .lean(true)
      .exec();
  },
  getRequestWithOwnerDetails: (requestId) => {
    return RequestModel.findById(requestId)
      .populate({
        path: '_ownerRef',
        select: {
          displayName: 1,
          profileImage: 1,
          rating: 1,
          _id: 1,
          notifications: 1,
          email: 1,
          stripeCustomerAccId: 1,
          taskImages: 1,
        },
      })
      .lean()
      .exec();
  },
  getRequestWithReviewModel: async (requestId, ownerId) => {
    return RequestModel.findOne({ _id: requestId, _ownerRef: ownerId })
      .populate({ path: '_reviewRef' })
      .lean()
      .exec();
  },

  kickStartReviewModel: async ({ requestId, taskerId, requesterId }) => {
    const kickStartReviewModel = await new ReviewModel({
      requestId,
      taskerId,
      requesterId,
    }).save();

    return RequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          _reviewRef: kickStartReviewModel._id,
        },
      },
      { new: true }
    )
      .lean(true)
      .exec();
  },

  getMyPostedRequests: async (userId, requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allRequests = await User.findOne({ userId: userId }, { _postedRequestsRef: 1 })
          .populate({
            path: '_postedRequestsRef',
            options: { sort: { startingDateAndTime: 1 } },
            populate: {
              path: '_bidsListRef',
              populate: {
                path: '_taskerRef',
                select: {
                  _asTaskerReviewsRef: 1,
                  _asRequesterReviewsRef: 1,
                  rating: 1,
                  userId: 1,
                  displayName: 1,
                  profileImage: 1,
                  personalParagraph: 1,
                  membershipStatus: 1,
                  createdAt: 1,
                  notifications: 1,
                },
              },
            },
          })
          .lean(true)
          .exec();

        if (allRequests && allRequests._postedRequestsRef) {
          const chosenRequest = allRequests._postedRequestsRef.find((request) => {
            return request._id.toString() === requestId;
          });

          resolve(chosenRequest);
        } else {
          resolve(allRequests);
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  addARequest: async (requestDetails, mongoUser_id) => {
    try {
      const newRequest = await new RequestModel({
        ...requestDetails,
        _ownerRef: mongoUser_id,
      }).save();

      await User.findOneAndUpdate(
        { _id: mongoUser_id },
        {
          $push: {
            _postedRequestsRef: {
              $each: [newRequest._id],
              sort: { 'newRequest.startingDateAndTime': 1 },
            },
          },
        },
        { projection: { _id: 1 } }
      )
        .lean(true)
        .exec();
      return newRequest.toObject();
    } catch (e) {
      throw e;
    }
  },
  updateViewedBy: (requestId, mongoUser_id) => {
    return RequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        $addToSet: {
          viewedBy: mongoUser_id,
        },
      }
    )
      .lean()
      .exec();
  },
  updateState: (requestId, stateValue) => {
    return RequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          state: stateValue,
        },
      }
    )
      .lean()
      .exec();
  },
  updateBooedBy: (requestId, mongoUser_id) => {
    return RequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        $addToSet: {
          booedBy: mongoUser_id,
        },
      }
    )
      .lean({ virtuals: true })
      .exec();
  },
  addRequestImages: async (requestId, images) => {
    try {
      let requestImagesArray = [];
      if (images && images.length > 0) {
        requestImagesArray = images.map((imgDetail) => {
          return {
            url: imgDetail.secure_url,
            public_id: imgDetail.public_id,
          };
        });
      }
      const updatedRequest = await RequestModel.findOneAndUpdate(
        { _id: requestId },
        {
          $push: {
            requestImages: { $each: requestImagesArray },
          },
        },
        { new: true }
      )
        .lean({ virtuals: true })
        .exec();

      return updatedRequest;
    } catch (e) {
      throw e;
    }
  },

  getFullRequestDetails: async (requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const requestWithTaskerDetails = await RequestModel.findOne({ _id: requestId })
          .populate([
            {
              path: '_awardedBidRef',
              select: {
                _taskerRef: 1,
                isNewBid: 1,
                state: 1,
                bidAmount: 1,
                createdAt: 1,
                updatedAt: 1,
              },
              populate: {
                path: '_taskerRef',
                select: {
                  displayName: 1,
                  email: 1,
                  phone: 1,
                  profileImage: 1,
                  rating: 1,
                  userId: 1,
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
                userId: 1,
              },
            },
          ])

          .lean(true)
          .exec();

        resolve(requestWithTaskerDetails);
      } catch (e) {
        reject(e);
      }
    });
  },

  // get requests near a given location
  // default search raduis is 15km raduis
  // default include all
  searchRequestsByLocationForLoggedInTasker: (
    { location, searchRadius = 25000, tasksTypeFilter },
    mongoUser_id = ''
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const today = moment.utc(moment()).toISOString();

        let searchQuery = {
          startingDateAndTime: { $gt: today },
          state: 'OPEN',
          templateId: { $in: tasksTypeFilter },
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [location.lng, location.lat],
              },
              $maxDistance: searchRadius * 1000,
              $minDistance: 0,
            },
          },
        };

        // filter by date
        const results = await RequestModel.find(searchQuery, {
          _ownerRef: 1,
          templateId: 1,
          startingDateAndTime: 1,
          location: 1,
          requestTitle: 1,
          _bidsListRef: 1,
          viewedBy: 1,
          hideFrom: 1,
          taskImages: 1,
          state: 1,
        })
          .sort({ startingDateAndTime: 1 })
          .populate([
            {
              path: '_ownerRef',
              select: { displayName: 1, profileImage: 1, _id: 1, rating: 1 },
            },
            {
              path: '_bidsListRef',
              select: { _taskerRef: 1, bidAmount: 1 },
            },
          ])
          .lean(true);

        requestsUserDidNotBidOn = results
          .filter((task) => {
            // for logged out user return all
            if (mongoUser_id === '') {
              return true;
            }

            // remove tasks that the current logged in user is owner of
            if (task._ownerRef._id.toString() === mongoUser_id.toString()) {
              return false;
            }

            // remove tasks that the user already bid on
            if (task._bidsListRef && task._bidsListRef.length > 0) {
              let currentUserAlreadyBid = task._bidsListRef.some(
                (bidsList) => bidsList._taskerRef.toString() === mongoUser_id.toString()
              );
              return !currentUserAlreadyBid;
            }

            // everything else
            return true;
          })
          .map((task) => {
            const hasBids = task._bidsListRef && task._bidsListRef.length > 0;
            if (hasBids) {
              const bidsList = task._bidsListRef;
              // add avgBid property
              const bidsTotal = bidsList
                .map((bid) => bid.bidAmount.value)
                .reduce((accumulator, bidAmount) => accumulator + bidAmount);
              task.avgBid = `${Math.ceil(bidsTotal / bidsList.length)}`;

              // remove any personal identifying info about other taskers
              const cleanBidsList = bidsList.map((bid) => ({ ...bid, bidAmount: {} }));
              task._bidsListRef = cleanBidsList;
            } else {
              task.avgBid = `--`;
            }
            return task;
          });
        return resolve(requestsUserDidNotBidOn);
      } catch (e) {
        reject(e);
      }
    });
  },

  getUsersNearRequestAndNotifyThem: async (request, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let searchQuery = {
          userId: { $not: { $in: [userId] } },
          'email.isVerified': { $eq: true },
          'notifications.newPostedTasks': { $eq: true },
          lastSearch: { $exists: true },
          'lastSearch.tasksTypeFilter': request.templateId,
          'lastSearch.location': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [request.location.coordinates[0], request.location.coordinates[1]],
              },
              // XXXXX MAKE SURE TO READ LOATION.SEARCHRADUIS INSTEAD
              $maxDistance: 100 * 1000,
              $minDistance: 0,
            },
          },
        };

        const userstoNotify = await User.find(searchQuery, {
          email: 1,
          lastSearch: 1,
          notifications: 1,
          displayName: 1,
          pushSubscription: 1,
        })
          .lean()
          .exec();

        if (userstoNotify && userstoNotify.length > 0) {
          userstoNotify.forEach((user) => {
            sendGridEmailing.sendNewRequestInYourAreaNotification({
              to: user.email.emailAddress,
              requestTitle: templateIdToDisplayName[request.templateId],
              toDisplayName: user.displayName,
              linkForTasker: ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id),
            });
            WebPushNotifications.pushNewRequestInYourArea(user.pushSubscription, {
              requestTitle: templateIdToDisplayName[request.templateId],
              urlToLaunch: ROUTES.CLIENT.TASKER.getDynamicBidOnRequestPage(request._id),
            });
          });
        }
        resolve({ success: true });
      } catch (e) {
        console.log('BIDORBOO_ERROR: couldnt notify interested taskers ' + JSON.stringify(e));
      }
    });
  },

  updateRequestWithAwardedBidAndPaymentDetails: async (
    requestId,
    bidId,
    processedPaymentDetails
  ) => {
    return RequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          _awardedBidRef: bidId,
          state: 'AWARDED',
          processedPayment: processedPaymentDetails,
        },
      }
    )
      .lean()
      .exec();
  },

  findOneByRequestId: (id) => {
    return RequestModel.findOne({ _id: id })
      .populate({ path: '_ownerRef' })
      .lean({ virtuals: true })
      .exec();
  },
  isRequestOwner: (mongoUser_id, requestId) => {
    return RequestModel.findOne({ _id: requestId }, { _ownerRef: 1 })
      .where('_ownerRef')
      .equals(mongoUser_id)
      .lean({ virtuals: true })
      .exec();
  },
  isAwardedTasker: (mongoUser_id, requestId) => {
    return RequestModel.findOne({ _id: requestId }, { _awardedBidRef: 1 })
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
      .lean({ virtuals: true })
      .exec();
  },

  findOneByRequestIdAndUpdateRequestInfo: (requestId, newRequestDetails, options) => {
    // xxx review this to do , validate user input and use some sanitizer tool to prevent coded content
    return RequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        $set: { ...newRequestDetails },
      },
      options
    )
      .lean({ virtuals: true })
      .exec();
  },

  requesterConfirmsRequestCompletion: async (requestId, completionDate) => {
    // if tasker didnt
    return new Promise(async (resolve, reject) => {
      try {
        await RequestModel.findOneAndUpdate(
          { _id: requestId },
          {
            $set: { state: 'DONE', completionDate: completionDate },
          }
        )
          .lean(true)
          .exec();

        const updatedRequest = await RequestModel.findById(requestId)
          .populate({
            path: '_awardedBidRef',
            select: { _taskerRef: 1 },
          })
          .lean(true)
          .exec();

        // update stuff
        await Promise.all([
          User.findByIdAndUpdate(
            updatedRequest._awardedBidRef._taskerRef,
            {
              $push: { 'rating.fulfilledBids': updatedRequest._awardedBidRef },
            },
            {
              new: true,
            }
          )
            .lean(true)
            .exec(),
          User.findByIdAndUpdate(
            updatedRequest._ownerRef,
            {
              $push: { 'rating.fulfilledRequests': requestId },
            },
            {
              new: true,
            }
          )
            .lean(true)
            .exec(),
        ]);

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
        } = await getAllContactDetails(requestId);

        if (allowedToEmailRequester) {
          sendGridEmailing.tellRequesterRequestIsCompleteBeginRating({
            to: requesterEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }
        if (allowedToEmailTasker) {
          sendGridEmailing.tellTaskerRequestIsCompleteBeginRating({
            to: taskerEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: taskerDisplayName,
            linkForTasker: requestLinkForTasker,
          });
        }

        if (allowedToTextRequester) {
          sendTextService.sendRequestIsCompletedText(
            requesterPhoneNumber,
            requestDisplayName,
            requestLinkForRequester
          );
        }
        if (allowedToTextTasker) {
          sendTextService.sendRequestIsCompletedText(
            taskerPhoneNumber,
            requestDisplayName,
            requestLinkForTasker
          );
        }

        if (allowedToPushNotifyRequester) {
          WebPushNotifications.pushAwardedRequestWasCompleted(requesterPushNotSubscription, {
            requestTitle: requestDisplayName,
            urlToLaunch: requestLinkForRequester,
          });
        }
        if (allowedToPushNotifyTasker) {
          WebPushNotifications.pushAwardedRequestWasCompleted(taskerPushNotSubscription, {
            requestTitle: requestLinkForRequester,
            urlToLaunch: requestLinkForTasker,
          });
        }

        resolve({ success: true });
      } catch (e) {
        reject(e);
      }
    });
  },
  taskerConfirmsRequestCompletion: async (requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedRequest = await RequestModel.findOneAndUpdate(
          { _id: requestId },
          {
            $set: { taskerConfirmedCompletion: true },
          },
          { new: true }
        )
          .lean()
          .exec();

        const {
          requesterDisplayName,
          taskerDisplayName,
          requestDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          allowedToEmailRequester,
          allowedToEmailTasker,
          allowedToTextRequester,
          allowedToPushNotifyRequester,
          requesterPushNotSubscription,
        } = await getAllContactDetails(requestId);

        // send communication to both about the cancellation
        if (allowedToEmailRequester) {
          sendGridEmailing.tellRequesterToConfirmCompletion({
            to: requesterEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }
        if (allowedToEmailTasker) {
          sendGridEmailing.tellTaskerWeWaitingOnRequesterToConfirmCompletion({
            to: taskerEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: taskerDisplayName,
            linkForTasker: requestLinkForTasker,
          });
        }

        if (allowedToTextRequester) {
          sendTextService.sendRequestAwaitingRequesterConfirmCompletionText(
            requesterPhoneNumber,
            requestDisplayName,
            requestLinkForRequester
          );
        }

        if (allowedToPushNotifyRequester) {
          WebPushNotifications.sendRequestAwaitingRequesterConfirmCompletionText(
            requesterPushNotSubscription,
            {
              requestTitle: requestDisplayName,
              urlToLaunch: requestLinkForRequester,
            }
          );
        }
        resolve({
          success: true,
        });
      } catch (e) {
        reject(e);
      }
    });
  },

  taskerDisputesRequest: async ({ requestId, reason, details }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedRequest = await RequestModel.findOneAndUpdate(
          { _id: requestId },
          {
            $set: {
              'dispute.taskerDispute': {
                reason,
                details,
              },
              state: 'DISPUTED',
            },
          },
          { new: true }
        )
          .lean()
          .exec();

        const {
          taskerId,
          requesterDisplayName,
          taskerDisplayName,
          requestDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          allowedToEmailTasker,
          processedPayment,
        } = await getAllContactDetails(requestId);

        sendGridEmailing.informBobCrewAboutDispute({
          whoSubmitted: 'Tasker',
          requesterDisplayName,
          taskerDisplayName,
          requestDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          requestId: updatedRequest._id,
          reason,
          details,
          userIdWhoFiledDispute: taskerId,
          processedPayment, //xxx think if this is risky to be floating around
        });

        if (allowedToEmailTasker) {
          sendGridEmailing.tellDisputeOwnerThatWeWillInvestigate({
            to: taskerEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: taskerDisplayName,
            linkForTasker: requestLinkForTasker,
          });
        }

        resolve({
          success: true,
        });
      } catch (e) {
        reject(e);
      }
    });
  },

  requesterDisputesRequest: async ({ requestId, reason, details }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedRequest = await RequestModel.findOneAndUpdate(
          { _id: requestId },
          {
            $set: {
              'dispute.requesterDispute': {
                reason,
                details,
              },
              state: 'DISPUTED',
            },
          },
          { new: true }
        )
          .lean()
          .exec();

        if (!updatedRequest || !updatedRequest._id || updatedRequest.state !== 'DISPUTED') {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated request taskerDisputesRequest',
          });
        }

        const {
          requesterId,
          requesterDisplayName,
          taskerDisplayName,
          requestDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          allowedToEmailRequester,
          processedPayment,
        } = await getAllContactDetails(requestId);

        // send communication to both about the cancellation
        if (allowedToEmailRequester) {
          sendGridEmailing.tellDisputeOwnerThatWeWillInvestigate({
            to: requesterEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }

        sendGridEmailing.informBobCrewAboutDispute({
          whoSubmitted: 'Requester',
          requesterDisplayName,
          taskerDisplayName,
          requestDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          requestId: updatedRequest._id,
          reason,
          details,
          userIdWhoFiledDispute: requesterId,
          processedPayment, //xxx think if this is risky to be floating around
        });

        resolve({
          success: true,
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  cancelRequest(requestId, mongoUser_id) {
    /**
     *
     * What we want to accomplish here
     *  - if request is open state
     *       update request status to CANCELED_OPEN
     *
     *  - if request is in Awarded state :
     *      - refund 80% to requester
     *      - 10% to Tasker
     *      - 10% to our platform
     *
     *
     *      - update REQUEST status to AWARDED_REQUEST_CANCELED_BY_REQUESTER
     *      - update REQUEST with the refund charge field on the request with the refund details
     *
     *      - find the AWARDED BID and switch its status to AWARDED_BID_CANCELED_BY_REQUESTER
     *
     *      - Update Requester User rating
     *                globalRating - 0.25 star
     *                totalOfAllRatings - 0.25
     *                numberOfTimesBeenRated + 1
     *                canceledRequests+ 1
     *
     *
     *
     *  - finally push notify to both informing them of this and emphasize to Tasker
     * that they should go place more bids
     *
     */
    return new Promise(async (resolve, reject) => {
      try {
        //find the request
        const request = await RequestModel.findOne({
          _id: requestId,
          _ownerRef: mongoUser_id,
        }).exec();

        if (!request || !request._id || !request._ownerRef._id || !request.state) {
          return reject('Error while canceling request. contact us at bidorboo@bidorboo.ca');
        }

        // if we are cancelling an open request
        if (request.state === 'OPEN') {
          await request.remove();
          resolve();
        }

        // if we are cancelling an awardedRequest
        else if (request.state === 'AWARDED' || request.state === 'AWARDED_SEEN') {
          // CANCELED_BY_REQUESTER_AWARDED case
          const {
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
            ownerRating,
          } = await getAllContactDetails(requestId);

          const newTotalOfAllRatings = ownerRating.totalOfAllRatings + 1.25;
          const newTotalOfAllTimesBeenRated = ownerRating.numberOfTimesBeenRated + 1;
          const newGlobalRating = parseFloat(
            Math.max(newTotalOfAllRatings / newTotalOfAllTimesBeenRated, 0).toFixed(1)
          );

          const paymentIntent = await stripeServiceUtil.getPaymentIntents(
            processedPayment.paymentIntentId
          );
          const charge = paymentIntent.charges.data[0];
          const refundCharge = await stripeServiceUtil.partialRefundTransation({
            chargeId: charge.id,
            refundAmount:
              charge.amount * BIDORBOO_REQUESTER_REFUND_PERCENTAGE_IN_CASE_OF_CANCELLATION,
            metadata: {
              requesterId,
              requesterEmailAddress,
              taskerId,
              taskerEmailAddress,
              requestedRequestId,
              awardedBidId,
              note: 'requester cancelled an awarded request',
            },
          });

          if (refundCharge.status === 'succeeded') {
            const [updatedRequest] = await Promise.all([
              RequestModel.findOneAndUpdate(
                { _id: requestId, _ownerRef: mongoUser_id },
                {
                  $set: {
                    state: 'AWARDED_REQUEST_CANCELED_BY_REQUESTER',
                    'processedPayment.refund': {
                      amount: refundCharge.amount,
                      charge: refundCharge.charge,
                      id: refundCharge.id,
                      status: refundCharge.status,
                    },
                  },
                  $push: { hideFrom: taskerId },
                },
                { new: true }
              )
                .lean(true)
                .exec(),

              User.findOneAndUpdate(
                { _id: mongoUser_id },
                {
                  $set: {
                    'rating.latestComment':
                      'BidOrBoo Auto Review: Cancelled their request after booking with the tasker',
                    'rating.globalRating': newGlobalRating,
                    'rating.numberOfTimesBeenRated': newTotalOfAllTimesBeenRated,
                    'rating.totalOfAllRatings': newTotalOfAllRatings,
                  },
                  $push: {
                    'rating.canceledRequests': requestId,
                  },
                },
                {
                  new: true,
                }
              )
                .lean(true)
                .exec(),
            ]);

            // send communication to both about the cancellation
            if (allowedToEmailRequester) {
              sendGridEmailing.tellRequeterThatTheyHaveCancelledAnAwardedRequest({
                to: requesterEmailAddress,
                requestTitle: requestDisplayName,
                toDisplayName: requesterDisplayName,
                linkForOwner: requestLinkForRequester,
              });
            }
            if (allowedToEmailTasker) {
              sendGridEmailing.tellTaskerThatRequesterCancelledRequest({
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

            resolve(updatedRequest);
          } else {
            reject({
              refund: refundCharge,
              errorMsg: 'refund status failed. bidorboo will get in touch',
            });
          }
        }
        // not open nor awarded request
        reject('something went wrong while canceling request');
      } catch (e) {
        reject(e);
      }
    });
  },

  cancelAwardedRequest: async (requestId, mongoUser_id) => {
    return _updateRequestStatus(requestId, mongoUser_id, 'CANCELED_AWARDED');
  },

  expireOpenRequest: async (requestId, mongoUser_id) => {
    return _updateRequestStatus(requestId, mongoUser_id, 'EXPIRED_OPEN');
  },

  expireAwardedRequest: async (requestId, mongoUser_id) => {
    return _updateRequestStatus(requestId, mongoUser_id, 'EXPIRED_AWARDED');
  },

  setDisputedRequest: async (requestId, mongoUser_id) => {
    return _updateRequestStatus(requestId, mongoUser_id, 'DISPUTED');
  },
  setRequestIsDone: async (requestId, mongoUser_id) => {
    return _updateRequestStatus(requestId, mongoUser_id, 'DONE');
  },
  setRequestIsPaidOut: async (requestId, mongoUser_id) => {
    return _updateRequestStatus(requestId, mongoUser_id, 'PAIDOUT');
  },

  setRescheduleRequested: async (requestId, mongoUser_id, newDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the request
        await RequestModel.findOneAndUpdate(
          { _id: requestId, _ownerRef: mongoUser_id },
          {
            $set: { state: 'RESCHEDULED_REQUEST', startingDateAndTime: newDate },
          }
        );
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },

  _updateRequestStatus: async (requestId, mongoUser_id, status) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the request
        await RequestModel.findOneAndUpdate(
          { _id: requestId, _ownerRef: mongoUser_id },
          {
            $set: { state: status },
          }
        );
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },
  updateLatestCheckoutSession: async (requestId, mongoUser_id, sessionClientId) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the request

        await RequestModel.findOne(
          { _id: requestId, _ownerRef: mongoUser_id },
          async (err, requestDoc) => {
            if (err) {
              return reject(err);
            }
            requestDoc.latestCheckoutSession = sessionClientId;
            await requestDoc.save();
            resolve(true);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  },
  updateRequestById: async (requestId, updateDetails) => {
    return new Promise(async (resolve, reject) => {
      try {
        await RequestModel.findByIdAndUpdate(requestId, {
          ...updateDetails,
        })
          .lean()
          .exec();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },

  deleteRequest: async (requestId, mongoUser_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the request
        const request = await RequestModel.findOne({ _id: requestId, _ownerRef: mongoUser_id })
          .populate({
            path: '_bidsListRef',
            select: { _id: 1, _taskerRef: 1 },
            populate: {
              path: '_taskerRef',
            },
          })
          .lean(true)
          .exec();

        const areThereAnyBids = request._bidsListRef && request._bidsListRef.length > 0;
        if (areThereAnyBids) {
          bidsIds = [];
          taskersIds = [];
          request._bidsListRef.forEach((bidRef) => {
            bidsIds.push(bidRef._id.toString());
            taskersIds.push(bidRef._taskerRef._id.toString());
          });

          taskersIds.forEach(async (taskerId) => {
            // clean ref for taskers
            await User.findOneAndUpdate(
              { _id: taskerId },
              { $pull: { _postedBidsRef: { $in: bidsIds } } },
              { new: true }
            )
              .lean(true)
              .exec();
          });

          bidsIds.forEach(async (bidId) => {
            await BidModel.deleteOne({ _id: bidId });
          });
        }

        await User.findOneAndUpdate(
          { _id: request._ownerRef.toString() },
          { $pull: { _postedRequestsRef: { $in: [request._id] } } },
          { new: true }
        )
          .lean(true)
          .exec();

        await RequestModel.deleteOne({ _id: request._id.toString() })
          .lean({ virtuals: true })
          .exec();

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },
  // all items below this line is optimal and final -----------------------------

  getMyRequestsSummary: async (_id) => {
    try {
      const myRequests = await RequestModel.find(
        { _ownerRef: { $eq: _id } },
        {
          _bidsListRef: 1,
          _awardedBidRef: 1,
          state: 1,
          templateId: 1,
          _reviewRef: 1,
          taskerConfirmedCompletion: 1,
          requestTitle: 1,
          startingDateAndTime: 1,
          taskImages: 1,
          dispute: 1,
          completionDate: 1,
        },
        { limit: 500, sort: { startingDateAndTime: 1 } }
      )
        .populate({
          path: '_reviewRef',
        })
        .populate({
          path: '_awardedBidRef',
          select: {
            isNewBid: 1,
          },
        })
        .lean({ virtuals: true })
        .exec();

      if (myRequests && myRequests.length > 0) {
        let augmentedReq = myRequests.map((request) => {
          if (['DONE', 'DONE_SEEN'].includes(request.state)) {
            const reviewRef = request._reviewRef;

            const revealToBoth = !!(
              reviewRef &&
              reviewRef.requesterReview &&
              reviewRef.taskerReview
            );

            const requiresRequesterReview = !reviewRef || (reviewRef && !reviewRef.requesterReview);

            const requiresTaskerReview = !reviewRef || (reviewRef && !reviewRef.taskerReview);
            request._reviewRef = {
              revealToBoth,
              requiresRequesterReview,
              requiresTaskerReview,
            };
          }
          return request;
        });

        return augmentedReq;
      }

      return [];
    } catch (e) {
      throw e;
    }
  },

  // everything below this line is great --------------------
  requestToBidOnDetailsForTasker: async (requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const requestWithBidDetails = await RequestModel.findOne(
          { _id: requestId },
          {
            _ownerRef: 1,
            _bidsListRef: 1,
            title: 1,
            state: 1,
            viewedBy: 1,
            detailedDescription: 1,
            requestTitle: 1,
            location: 1,
            startingDateAndTime: 1,
            durationOfRequest: 1,
            templateId: 1,
            extras: 1,
            taskImages: 1,
          }
        )
          .populate([
            { path: '_ownerRef', select: { displayName: 1, profileImage: 1, _id: 1, rating: 1 } },
            { path: '_bidsListRef', select: { bidAmount: 1 } },
          ])
          .lean({ virtuals: true })
          .exec();

        const hasBids =
          requestWithBidDetails._bidsListRef && requestWithBidDetails._bidsListRef.length > 0;
        if (hasBids) {
          const bidsList = requestWithBidDetails._bidsListRef;
          // add avgBid property
          const bidsTotal = bidsList
            .map((bid) => bid.bidAmount.value)
            .reduce((accumulator, bidAmount) => accumulator + bidAmount);
          requestWithBidDetails.avgBid = `${Math.ceil(bidsTotal / bidsList.length)}`;

          // remove any personal identifying info about other taskers
          const cleanBidsList = bidsList.map((bid) => ({ ...bid, bidAmount: {} }));
          requestWithBidDetails._bidsListRef = cleanBidsList;
        } else {
          requestWithBidDetails.avgBid = `--`;
        }

        resolve(requestWithBidDetails);
      } catch (e) {
        reject(e);
      }
    });
  },

  getArchivedTaskDetailsForRequester: async ({ mongoUser_id, requestId }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const archivedRequestDetails = await RequestModel.findOne(
          { _id: requestId, _ownerRef: mongoUser_id },
          { processedPayment: 0, payoutDetails: 0 }
        )
          .populate([
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
          ])
          .lean()
          .exec();

        if (archivedRequestDetails && archivedRequestDetails._id) {
          if (
            !(
              archivedRequestDetails._reviewRef &&
              archivedRequestDetails._reviewRef.requesterReview &&
              archivedRequestDetails._reviewRef.taskerReview
            )
          ) {
            archivedRequestDetails._reviewRef.taskerReview = null;
          }
          return resolve(archivedRequestDetails);
        }
        reject('cant find the specified Request');
      } catch (e) {
        reject(e);
      }
    });
  },

  getAwardedRequestFullDetailsForRequester: async (requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const requestWithTaskerDetails = await RequestModel.findOne(
          { _id: requestId },
          { processedPayment: 0, payoutDetails: 0 }
        )
          .populate([
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
                  email: 1,
                  phone: 1,
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
          ])
          .lean(true)
          .exec();

        if (!requestWithTaskerDetails || !requestWithTaskerDetails._id) {
          return reject("Couldn't find the specified Request");
        }
        if (['DONE', 'DONE_SEEN'].includes(requestWithTaskerDetails.state)) {
          const reviewRef = requestWithTaskerDetails._reviewRef;

          const revealToBoth = !!(reviewRef && reviewRef.requesterReview && reviewRef.taskerReview);

          const requiresRequesterReview = !reviewRef || (reviewRef && !reviewRef.requesterReview);

          const requiresTaskerReview = !reviewRef || (reviewRef && !reviewRef.taskerReview);

          requestWithTaskerDetails._reviewRef = {
            revealToBoth,
            requiresRequesterReview,
            requiresTaskerReview,
          };
        }
        resolve(requestWithTaskerDetails);
      } catch (e) {
        reject(e);
      }
    });
  },

  postedRequestAndBidsForRequester: async (mongDbUserId, requestId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const requestWithBidDetails = await RequestModel.findOne({
          _id: requestId,
          _ownerRef: mongDbUserId,
        })
          .populate([
            {
              path: '_ownerRef',
              select: {
                displayName: 1,
                profileImage: 1,
                rating: 1,
                _id: 1,
              },
            },

            {
              path: '_bidsListRef',
              select: {
                _taskerRef: 1,
                isNewBid: 1,
                requesterPayment: 1,
                requesterPartialRefund: 1,
                _requestRef: 1,
              },
              populate: {
                path: '_taskerRef',
                select: {
                  isGmailUser: 1,
                  isFbUser: 1,
                  displayName: 1,
                  profileImage: 1,
                  membershipStatus: 1,
                  rating: 1,
                  'email.isVerified': 1,
                  'phone.isVerified': 1,
                  'stripeConnect.isVerified': 1,
                },
              },
            },
          ])
          .lean({ virtuals: true })
          .exec();

        resolve(requestWithBidDetails);
      } catch (e) {
        reject(e);
      }
    });
  },
};
