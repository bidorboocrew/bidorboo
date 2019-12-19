//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');
const ReviewModel = mongoose.model('ReviewModel');

const moment = require('moment');
const ROUTES = require('../backend-route-constants');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const stripeServiceUtil = require('../services/stripeService').util;

const {
  BIDORBOO_REQUESTER_REFUND_PERCENTAGE_IN_CASE_OF_CANCELLATION,
} = require('../utils/chargesCalculatorUtil');

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedJobOwnerTaskerAndRelevantNotificationDetails;
const templateIdToDisplayName = {
  bdbHouseCleaning: 'House Cleaning',
  bdbCarDetailing: 'Car Detailing',
  bdbPetSittingWalking: 'Pet Sitting/Walking',
  bdbMoving: 'Moving/Lifting Helpers',
};
exports.jobDataAccess = {
  BidOrBooAdmin: {
    SendRemindersForUpcomingJobs: async () => {
      try {
        const now = moment()
          .tz('America/Toronto')
          .toISOString();

        const theNext24Hours = moment()
          .tz('America/Toronto')
          .add(1, 'day')
          .toISOString();

        await JobModel.find({
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
          .lean()
          .exec((err, res) => {
            if (err) {
              throw err;
            }
            if (res && res.length > 0) {
              try {
                res.forEach(async (job) => {
                  const jobStartDate = job.startingDateAndTime;

                  // normalize the start date to the same timezone to comapre
                  const normalizedStartDate = moment(jobStartDate)
                    .tz('America/Toronto')
                    .toISOString();

                  const isJobHappeningAfterNow = moment(normalizedStartDate).isAfter(now);
                  const isJobHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(
                    theNext24Hours
                  );

                  if (isJobHappeningAfterNow && isJobHappeningBeforeTomorrow) {
                    const jobId = job._id.toString();
                    const awardedBidId = job._awardedBidRef._id.toString();
                    const ownerDetails = job._ownerRef;
                    const ownerEmailAddress =
                      ownerDetails.email && ownerDetails.email.emailAddress
                        ? ownerDetails.email.emailAddress
                        : '';
                    const ownerPhoneNumber =
                      ownerDetails.phone && ownerDetails.phone.phoneNumber
                        ? ownerDetails.phone.phoneNumber
                        : '';
                    const linkForOwner = ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedJobPage(
                      jobId
                    );
                    const awardedTaskerDetails = job._awardedBidRef._taskerRef;
                    const taskerEmailAddress =
                      awardedTaskerDetails.email && awardedTaskerDetails.email.emailAddress
                        ? awardedTaskerDetails.email.emailAddress
                        : '';
                    const taskerPhoneNumber =
                      awardedTaskerDetails.phone && awardedTaskerDetails.phone.phoneNumber
                        ? awardedTaskerDetails.phone.phoneNumber
                        : '';
                    const linkForTasker = ROUTES.CLIENT.TASKER.dynamicCurrentAwardedBid(
                      awardedBidId
                    );
                    if (ownerDetails.notifications && ownerDetails.notifications.email) {
                      sendGridEmailing.sendJobIsHappeningSoonToRequesterEmail({
                        to: ownerEmailAddress,
                        requestTitle: job.templateId,
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
                      sendGridEmailing.sendJobIsHappeningSoonToTaskerEmail({
                        to: taskerEmailAddress,
                        requestTitle: job.templateId,
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
                      sendTextService.sendJobIsHappeningSoonText(
                        ownerPhoneNumber,
                        job.templateId,
                        linkForOwner
                      );
                    }
                    if (
                      taskerPhoneNumber &&
                      awardedTaskerDetails.notifications &&
                      awardedTaskerDetails.notifications.text
                    ) {
                      sendTextService.sendJobIsHappeningSoonText(
                        taskerPhoneNumber,
                        job.templateId,
                        linkForTasker
                      );
                    }

                    if (ownerDetails.notifications && ownerDetails.notifications.push) {
                      WebPushNotifications.pushJobIsHappeningSoon(ownerDetails.pushSubscription, {
                        requestTitle: job.templateId,
                        urlToLaunch: linkForOwner,
                      });
                    }
                    if (
                      awardedTaskerDetails.notifications &&
                      awardedTaskerDetails.notifications.push
                    ) {
                      WebPushNotifications.pushJobIsHappeningSoon(
                        awardedTaskerDetails.pushSubscription,
                        {
                          requestTitle: job.templateId,
                          urlToLaunch: linkForTasker,
                        }
                      );
                    }
                  }
                });
              } catch (innerError) {
                throw innerError;
              }
            }
          });
        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: SendRemindersForUpcomingJobs_Error ' + JSON.stringify(e));
      }
    },
    CleanUpAllExpiredNonAwardedJobs: async () => {
      try {
        const rightNow = moment.utc(moment());

        await JobModel.find({
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
          .exec((err, res) => {
            if (err) {
              throw err;
            }

            if (res && res.length > 0) {
              res.forEach((job) => {
                const { _id: jobId, _ownerRef } = job;
                const jobStartDate = moment(job.startingDateAndTime);

                const isJobPastDue = moment(jobStartDate).isSameOrBefore(rightNow);

                if (isJobPastDue) {
                  try {
                    job.remove().catch((e) => {
                      console.log(
                        'BIDORBOO_ERROR: CleanUpAllExpiredNonAwardedJobs_REMOVE_JOB_ISSUE ' +
                          JSON.stringify(e)
                      );
                    });
                    console.log(
                      `CleanUpAllExpiredNonAwardedJobs deleted job id ${jobId} which was suppose to happen ${jobStartDate} on this day ${rightNow}`
                    );
                  } catch (innerError) {
                    throw innerError;
                  }
                }
              });
            }
          });

        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: CleanUpAllExpiredNonAwardedJobs_Error ' + JSON.stringify(e));
      }
    },
    nagRequesterToConfirmJob: async () => {
      try {
        await JobModel.find({
          $and: [
            { state: { $in: ['AWARDED', 'AWARDED_SEEN'] } },
            { dispute: { $exists: false } },
            { taskerConfirmedCompletion: { $eq: true } },
            { _awardedBidRef: { $exists: true } },
          ],
        })
          .lean(true)
          .exec((err, res) => {
            if (err) {
              throw err;
            }

            const threeDaysAgo = moment.utc().subtract(3, 'days');

            if (res && res.length > 0) {
              try {
                res.forEach(async (job) => {
                  const jobStartDate = job.startingDateAndTime;
                  const markAsDoneAnyways = moment(jobStartDate).isBefore(threeDaysAgo);

                  const {
                    requesterDisplayName,
                    jobDisplayName,
                    requestLinkForRequester,
                    requesterEmailAddress,
                    requesterPhoneNumber,
                    allowedToEmailRequester,
                    allowedToTextRequester,
                    allowedToPushNotifyRequester,
                    requesterPushNotSubscription,
                  } = await getAllContactDetails(job._id);

                  if (markAsDoneAnyways) {
                    console.log('-------AUTO MARK JOB DONE----------------------');
                    console.log(job._id);

                    await JobModel.findOneAndUpdate(
                      { _id: job._id },
                      {
                        $set: {
                          state: 'DONE',
                        },
                      }
                    )
                      .lean(true)
                      .exec();
                    console.log('-------AUTO MARK JOB DONE----------------------');
                    if (allowedToEmailRequester) {
                      console.log(
                        'sensendGridEmailingdTextService.tellRequesterThatWeMarkedJobDone'
                      );
                      console.log({
                        to: requesterEmailAddress,
                        requestTitle: jobDisplayName,
                        toDisplayName: requesterDisplayName,
                        linkForOwner: requestLinkForRequester,
                      });
                      sendGridEmailing.tellRequesterThatWeMarkedJobDone({
                        to: requesterEmailAddress,
                        requestTitle: jobDisplayName,
                        toDisplayName: requesterDisplayName,
                        linkForOwner: requestLinkForRequester,
                      });
                    }

                    if (allowedToTextRequester) {
                      console.log('sendTextService.tellRequesterThatWeMarkedJobDone');
                      console.log({
                        requesterPhoneNumber,
                        jobDisplayName,
                        requestLinkForRequester,
                      });
                      sendTextService.tellRequesterThatWeMarkedJobDone(
                        requesterPhoneNumber,
                        jobDisplayName,
                        requestLinkForRequester
                      );
                    }

                    if (allowedToPushNotifyRequester) {
                      console.log('WebPushNotifications.tellRequesterToConfirmJob');
                      console.log({
                        requestTitle: jobDisplayName,
                        urlToLaunch: requestLinkForRequester,
                      });

                      WebPushNotifications.tellRequesterToConfirmJob(requesterPushNotSubscription, {
                        requestTitle: jobDisplayName,
                        urlToLaunch: requestLinkForRequester,
                      });
                    }
                  } else {
                    if (allowedToEmailRequester) {
                      console.log('sensendGridEmailingdTextService.tellRequesterToConfirmJob');
                      console.log({
                        to: requesterEmailAddress,
                        requestTitle: jobDisplayName,
                        toDisplayName: requesterDisplayName,
                        linkForOwner: requestLinkForRequester,
                      });
                      sendGridEmailing.tellRequesterToConfirmJob({
                        to: requesterEmailAddress,
                        requestTitle: jobDisplayName,
                        toDisplayName: requesterDisplayName,
                        linkForOwner: requestLinkForRequester,
                      });
                    }

                    if (allowedToTextRequester) {
                      console.log('sendTextService.tellRequesterToConfirmJob');
                      console.log({
                        requesterPhoneNumber,
                        jobDisplayName,
                        requestLinkForRequester,
                      });
                      sendTextService.tellRequesterToConfirmJob(
                        requesterPhoneNumber,
                        jobDisplayName,
                        requestLinkForRequester
                      );
                    }

                    if (allowedToPushNotifyRequester) {
                      console.log('WebPushNotifications.tellRequesterToConfirmJob');
                      console.log({
                        requestTitle: jobDisplayName,
                        urlToLaunch: requestLinkForRequester,
                      });

                      WebPushNotifications.tellRequesterToConfirmJob(requesterPushNotSubscription, {
                        requestTitle: jobDisplayName,
                        urlToLaunch: requestLinkForRequester,
                      });
                    }
                  }
                });
              } catch (innerError) {
                throw innerError;
              }
            }
          });

        return;
      } catch (e) {
        console.log('BIDORBOO_ERROR: nagRequesterToConfirmJob_Error ' + JSON.stringify(e));
      }
    },
    SendPayoutsToBanks: async () => {
      try {
        // find all jobs that are done and does not have payment to bank on the way

        console.log(' SendPayoutsToBanks');
        return JobModel.find({
          _awardedBidRef: { $exists: true },
          processedPayment: { $exists: true },
          state: { $eq: 'DONE' },
          paymentToBank: { $exists: false },
        })
          .lean(true)
          .exec((err, res) => {
            if (err) {
              throw err;
            }

            if (res && res.length > 0) {
              try {
                //xxxxxx
                res.forEach(async (job) => {
                  const { _id: jobId, processedPayment } = job;
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

                  // confirm payouts enabeld
                  if (taskerConnectAccDetails && taskerConnectAccDetails.payouts_enabled) {
                    let taskerPayout = 0;
                    if (refund && refund.status === 'succeeded') {
                      // application fee is refunded at a rate proportional to the refund amount
                      //  so

                      // XXX you dont need to calc , this should be available in the refund amount
                      const ratioOfRefund = refund.amount / amount;
                      const amountRefundedFromApplicationFee = ratioOfRefund * applicationFeeAmount;
                      const actualKeptBidOrBooApplicationFees =
                        applicationFeeAmount - amountRefundedFromApplicationFee;

                      taskerPayout = amount - refund.amount - actualKeptBidOrBooApplicationFees;
                    } else if (refund && refund.status !== 'succeeded') {
                      console.log(
                        'BIDORBOO_PAYMENTS: DANGER INVESTIGATE WHY THIS IS NOT SUCCESSFUL' +
                          JSON.stringify(job)
                      );
                      return;
                    }
                    if (!refund) {
                      taskerPayout = amount - applicationFeeAmount;
                    }

                    // xxxxxxxx saeed investigate if this is asfer than relying on db
                    // const {
                    //   amount_received,
                    //   application_fee_amount,
                    //   transfer_data: { destination: destinationStripeAcc },
                    // } = await stripeServiceUtil.getPaymentIntents(paymentIntentId);

                    // taskerPayout = amount_received - application_fee_amount;

                    const [accountBalance] = await stripeServiceUtil.getConnectedAccountBalance(
                      destinationStripeAcc
                    );

                    let totalAvailableBalanceForPayout =
                      accountBalance &&
                      accountBalance.available &&
                      accountBalance.available.reduce(
                        (sumOfAllAvailableBalances, balanceItem) =>
                          sumOfAllAvailableBalances + balanceItem.amount,
                        0
                      );

                    let isThereEnoughToCoverPayout = totalAvailableBalanceForPayout >= taskerPayout;
                    // confirm there is enough available balance to cover payment
                    if (isThereEnoughToCoverPayout) {
                      console.log('send payout');
                      const payoutInititated = await stripeServiceUtil.payoutToBank(
                        destinationStripeAcc,
                        {
                          amount: taskerPayout,
                          metadata: {
                            paymentIntentId,
                            jobId: jobId.toString(),
                            destinationStripeAcc,
                            note: 'Released Payout to Tasker',
                          },
                        }
                      );
                      console.log({
                        amount: taskerPayout,
                        paymentIntentId,
                        jobId: jobId.toString(),
                        destinationStripeAcc,
                        note: 'Release Payout to Tasker',
                      });
                      const { id: payoutId, status } = payoutInititated;
                      // update job with the payment details
                      JobModel.findOneAndUpdate(
                        { _id: jobId },
                        {
                          $set: {
                            state: 'PAYMENT_RELEASED',
                            payoutDetails: {
                              payoutId,
                              status,
                            },
                          },
                        }
                      )
                        .exec()
                        .catch((fail) =>
                          console.log(
                            'BIDORBOO_ERROR: SendPayoutsToBanks_Error ' + JSON.stringify(fail)
                          )
                        );
                      // xxx on update job update bid
                    } else {
                      console.log('BIDORBOO_PAYMENTS: NOT_ENOUGH_TO_PAYOUT');
                      console.log('destinationStripeAcc ' + destinationStripeAcc);
                      console.log('job ' + JSON.stringify(job));
                      console.log('-----------------------------------------');
                    }
                  } else {
                    console.log(
                      'BIDORBOO_PAYMENTS: DANGER PAYOUT IS NOT ENABLED PLEASE INVESTIGATE WHY'
                    );
                    console.log('destinationStripeAcc ' + destinationStripeAcc);
                    console.log('job ' + JSON.stringify(job));
                    console.log('-----------------------------------------');
                  }
                });
              } catch (innerError) {
                throw innerError;
              }
            }
          });
      } catch (e) {
        console.log('BIDORBOO_ERROR: SendPayoutsToBanks_Error ' + JSON.stringify(e));
      }
    },

    CleanUpAllBidsAssociatedWithDoneJobs: async () => {
      try {
        await JobModel.find({
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
          .exec((err, res) => {
            if (err) {
              throw err;
            }

            if (res && res.length > 0) {
              try {
                res.forEach((job) => {
                  const areThereAnyBids = job._bidsListRef && job._bidsListRef.length > 0;
                  if (areThereAnyBids) {
                    bidsIds = [];
                    taskersIds = [];
                    const awardedBidRefId = job._awardedBidRef._id.toString();

                    job._bidsListRef.forEach((bidRef) => {
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
                            'BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneJobs_Error User.findOneAndUpdate ' +
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
                            'BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneJobs_Error BidModel.deleteOne ' +
                              JSON.stringify(fail2)
                          )
                        );
                    });
                  }
                });
              } catch (innerError) {
                throw innerError;
              }
            }
          });

        return;
      } catch (e) {
        console.log(
          'BIDORBOO_ERROR: CleanUpAllBidsAssociatedWithDoneJobs_Error ' + JSON.stringify(e)
        );
      }
    },
  },

  // get jobs for a user and filter by a given state
  getUserAwardedJobs: async (userId) => {
    return User.findOne({ userId: userId }, { _postedJobsRef: 1 })
      .populate({
        path: '_postedJobsRef',
        select: {
          addressText: 1,
          templateId: 1,
          startingDateAndTime: 1,
          _awardedBidRef: 1,
          createdAt: 1,
          _reviewRef: 1,
          _id: 1,
        },
        match: {
          state: { $in: ['AWARDED', 'AWARDED_SEEN'] },
          $or: [
            { _reviewRef: { $exists: false } },
            { '_reviewRef.requiresProposerReview': { $eq: true } },
          ],
        },
        options: { sort: { startingDateAndTime: 1 } },
        populate: [
          {
            path: '_awardedBidRef',
            select: {
              _taskerRef: 1,
              isNewBid: 1,
              state: 1,
              createdAt: 1,
              updatedAt: 1,
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
              },
            },
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
      .lean({ virtuals: true })
      .exec();
  },

  getJobById: (jobId) => {
    return JobModel.findById(jobId)
      .lean(true)
      .exec();
  },
  getBidsList: (jobId) => {
    return JobModel.findById(jobId)
      .populate({ path: '_bidsListRef', select: { _taskerRef: 1 } })
      .lean(true)
      .exec();
  },
  getJobWithOwnerDetails: (jobId) => {
    return JobModel.findById(jobId)
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
      .lean({ virtuals: true })
      .exec();
  },
  getJobWithReviewModel: async (jobId, ownerId) => {
    return JobModel.findOne({ _id: jobId, _ownerRef: ownerId })
      .populate({ path: '_reviewRef' })
      .lean({ virtuals: true })
      .exec();
  },

  kickStartReviewModel: async ({ jobId, taskerId, proposerId }) => {
    const kickStartReviewModel = await new ReviewModel({
      jobId,
      taskerId,
      proposerId,
    }).save();

    return JobModel.findOneAndUpdate(
      { _id: jobId },
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

  getMyPostedJobs: async (userId, jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allJobs = await User.findOne({ userId: userId }, { _postedJobsRef: 1 })
          .populate({
            path: '_postedJobsRef',
            options: { sort: { startingDateAndTime: 1 } },
            populate: {
              path: '_bidsListRef',
              populate: {
                path: '_taskerRef',
                select: {
                  _asTaskerReviewsRef: 1,
                  _asProposerReviewsRef: 1,
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

        if (allJobs && allJobs._postedJobsRef) {
          const chosenJob = allJobs._postedJobsRef.find((job) => {
            return job._id.toString() === jobId;
          });

          resolve(chosenJob);
        } else {
          resolve(allJobs);
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  addAJob: async (jobDetails, mongoUser_id) => {
    try {
      const newJob = await new JobModel({
        ...jobDetails,
        _ownerRef: mongoUser_id,
      }).save();

      await User.findOneAndUpdate(
        { _id: mongoUser_id },
        {
          $push: {
            _postedJobsRef: {
              $each: [newJob._id],
              sort: { 'newJob.startingDateAndTime': 1 },
            },
          },
        },
        { projection: { _id: 1 } }
      )
        .lean(true)
        .exec();
      return newJob.toObject();
    } catch (e) {
      throw e;
    }
  },
  updateViewedBy: (jobId, mongoUser_id) => {
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $addToSet: {
          viewedBy: mongoUser_id,
        },
      }
    )
      .lean()
      .exec();
  },
  updateState: (jobId, stateValue) => {
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $set: {
          state: stateValue,
        },
      }
    )
      .lean()
      .exec();
  },
  updateBooedBy: (jobId, mongoUser_id) => {
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $addToSet: {
          booedBy: mongoUser_id,
        },
      }
    )
      .lean({ virtuals: true })
      .exec();
  },
  addJobImages: async (jobId, images) => {
    try {
      let jobImagesArray = [];
      if (images && images.length > 0) {
        jobImagesArray = images.map((imgDetail) => {
          return {
            url: imgDetail.secure_url,
            public_id: imgDetail.public_id,
          };
        });
      }
      const updatedJob = await JobModel.findOneAndUpdate(
        { _id: jobId },
        {
          $push: {
            jobImages: { $each: jobImagesArray },
          },
        },
        { new: true }
      )
        .lean({ virtuals: true })
        .exec();

      return updatedJob;
    } catch (e) {
      throw e;
    }
  },

  getFullJobDetails: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobWithTaskerDetails = await JobModel.findOne({ _id: jobId })
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
              select: {
                proposerReview: 1,
                taskerReview: 1,
                revealToBoth: 1,
                requiresProposerReview: 1,
                requiresTaskerReview: 1,
              },
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

          .lean({ virtuals: true })
          .exec();

        resolve(jobWithTaskerDetails);
      } catch (e) {
        reject(e);
      }
    });
  },
  getAllJobsToBidOnForLoggedOut: async () => {
    // wil return all jobs in the system
    return new Promise(async (resolve, reject) => {
      try {
        const openJobsForBidding = await JobModel.find(
          { state: { $eq: 'OPEN' } },
          {
            _ownerRef: 1,
            templateId: 1,
            startingDateAndTime: 1,
            extras: 1,
            state: 1,
            location: 1,
            jobTitle: 1,
          },
          {
            sort: { startingDateAndTime: 1 },
            allowDiskUse: true,
          }
        )
          .populate({
            path: '_ownerRef',
            select: { displayName: 1, profileImage: 1, _id: 1, rating: 1 },
          })
          .populate({
            path: '_bidsListRef',
            select: { _taskerRef: 1, bidAmount: 1 },
          })
          .lean({ virtuals: true })
          .exec();
        return resolve(openJobsForBidding);
      } catch (e) {
        return reject(e);
      }
    });
  },

  getAllJobsToBidOn: async (mongoUser_id) => {
    // wil return all jobs in the system
    return new Promise(async (resolve, reject) => {
      try {
        const openJobsForBidding = await JobModel.find(
          { $and: [{ state: { $eq: 'OPEN' }, _ownerRef: { $ne: mongoUser_id.toString() } }] },
          {
            _ownerRef: 1,
            templateId: 1,
            startingDateAndTime: 1,
            extras: 1,
            state: 1,
            location: 1,
            jobTitle: 1,
            taskImages: 1,
          },
          {
            sort: { startingDateAndTime: 1 },
            allowDiskUse: true,
          }
        )
          .populate({
            path: '_ownerRef',
            select: { displayName: 1, profileImage: 1, _id: 1, rating: 1 },
          })
          .populate({
            path: '_bidsListRef',
            select: { _taskerRef: 1, bidAmount: 1 },
          })
          .lean({ virtuals: true })
          .exec();
        return resolve(openJobsForBidding);
      } catch (e) {
        return reject(e);
      }
    });
  },
  // get jobs near a given location
  // default search raduis is 15km raduis
  // default include all
  getJobsNear: ({ location, searchRadius = 25000, tasksTypeFilter }, mongoUser_id = '') => {
    return new Promise(async (resolve, reject) => {
      try {
        const today = moment.utc(moment()).toISOString();

        let searchQuery = {
          startingDateAndTime: { $gt: today },
          state: { $eq: 'OPEN' },
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
        const results = await JobModel.find(searchQuery, {
          _ownerRef: 1,
          templateId: 1,
          startingDateAndTime: 1,
          location: 1,
          jobTitle: 1,
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

        jobsUserDidNotBidOn = results
          .filter((task) => {
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
        return resolve(jobsUserDidNotBidOn);
      } catch (e) {
        reject(e);
      }
    });
  },

  getUsersNearJobAndNotifyThem: async (job, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let searchQuery = {
          userId: { $not: { $in: [userId] } },
          'email.isVerified': { $eq: true },
          'notifications.newPostedTasks': { $eq: true },
          lastSearch: { $exists: true },
          'lastSearch.tasksTypeFilter': job.templateId,
          'lastSearch.location': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [job.location.coordinates[0], job.location.coordinates[1]],
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
            sendGridEmailing.sendNewJobInYourAreaNotification({
              to: user.email.emailAddress,
              requestTitle: templateIdToDisplayName[job.templateId],
              toDisplayName: user.displayName,
              linkForTasker: ROUTES.CLIENT.TASKER.getDynamicBidOnJobPage(job._id),
            });
            WebPushNotifications.pushNewJobInYourArea(user.pushSubscription, {
              requestTitle: templateIdToDisplayName[job.templateId],
              urlToLaunch: ROUTES.CLIENT.TASKER.getDynamicBidOnJobPage(job._id),
            });
          });
        }
        resolve({ success: true });
      } catch (e) {
        console.log('BIDORBOO_ERROR: couldnt notify interested taskers ' + JSON.stringify(e));
      }
    });
  },

  updateJobWithAwardedBidAndPaymentDetails: async (jobId, bidId, processedPaymentDetails) => {
    return JobModel.findOneAndUpdate(
      { _id: jobId },
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

  findOneByJobId: (id) => {
    return JobModel.findOne({ _id: id })
      .populate({ path: '_ownerRef' })
      .lean({ virtuals: true })
      .exec();
  },
  isJobOwner: (mongoUser_id, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _ownerRef: 1 })
      .where('_ownerRef')
      .equals(mongoUser_id)
      .lean({ virtuals: true })
      .exec();
  },
  isAwardedTasker: (mongoUser_id, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _awardedBidRef: 1 })
      .populate({
        path: '_awardedBidRef',
        select: {
          _taskerRef: 1,
        },
        populate: {
          path: '_taskerRef',
          match: { _id: { $eq: mongoUser_id } },
          select: { _id: 1 },
        },
      })
      .lean({ virtuals: true })
      .exec();
  },

  findOneByJobIdAndUpdateJobInfo: (jobId, newJobDetails, options) => {
    // xxx review this to do , validate user input and use some sanitizer tool to prevent coded content
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $set: { ...newJobDetails },
      },
      options
    )
      .lean({ virtuals: true })
      .exec();
  },

  requesterConfirmsJobCompletion: async (jobId, completionDate) => {
    // if tasker didnt
    return new Promise(async (resolve, reject) => {
      try {
        await JobModel.findOneAndUpdate(
          { _id: jobId },
          {
            $set: { state: 'DONE', completionDate: completionDate },
          }
        )
          .lean(true)
          .exec();

        const updatedJob = await JobModel.findById(jobId)
          .populate({
            path: '_awardedBidRef',
            select: { _taskerRef: 1 },
          })
          .lean(true)
          .exec();

        // update stuff
        await Promise.all([
          User.findByIdAndUpdate(
            updatedJob._awardedBidRef._taskerRef,
            {
              $push: { 'rating.fulfilledBids': updatedJob._awardedBidRef },
            },
            {
              new: true,
            }
          )
            .lean(true)
            .exec(),
          User.findByIdAndUpdate(
            updatedJob._ownerRef,
            {
              $push: { 'rating.fulfilledJobs': jobId },
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
        } = await getAllContactDetails(jobId);

        if (allowedToEmailRequester) {
          sendGridEmailing.tellRequesterJobIsCompleteBeginRating({
            to: requesterEmailAddress,
            requestTitle: jobDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }
        if (allowedToEmailTasker) {
          sendGridEmailing.tellTaskerJobIsCompleteBeginRating({
            to: taskerEmailAddress,
            requestTitle: jobDisplayName,
            toDisplayName: taskerDisplayName,
            linkForTasker: requestLinkForTasker,
          });
        }

        if (allowedToTextRequester) {
          sendTextService.sendJobIsCompletedText(
            requesterPhoneNumber,
            jobDisplayName,
            requestLinkForRequester
          );
        }
        if (allowedToTextTasker) {
          sendTextService.sendJobIsCompletedText(
            taskerPhoneNumber,
            jobDisplayName,
            requestLinkForTasker
          );
        }

        if (allowedToPushNotifyRequester) {
          WebPushNotifications.pushAwardedJobWasCompleted(requesterPushNotSubscription, {
            requestTitle: jobDisplayName,
            urlToLaunch: requestLinkForRequester,
          });
        }
        if (allowedToPushNotifyTasker) {
          WebPushNotifications.pushAwardedJobWasCompleted(taskerPushNotSubscription, {
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
  taskerConfirmsJobCompletion: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedJob = await JobModel.findOneAndUpdate(
          { _id: jobId },
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
          jobDisplayName,
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
        } = await getAllContactDetails(jobId);

        // send communication to both about the cancellation
        if (allowedToEmailRequester) {
          sendGridEmailing.tellRequesterToConfirmCompletion({
            to: requesterEmailAddress,
            requestTitle: jobDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }
        if (allowedToEmailTasker) {
          sendGridEmailing.tellTaskerWeWaitingOnRequesterToConfirmCompletion({
            to: taskerEmailAddress,
            requestTitle: jobDisplayName,
            toDisplayName: taskerDisplayName,
            linkForTasker: requestLinkForTasker,
          });
        }

        if (allowedToTextRequester) {
          sendTextService.sendJobAwaitingRequesterConfirmCompletionText(
            requesterPhoneNumber,
            jobDisplayName,
            requestLinkForRequester
          );
        }

        if (allowedToPushNotifyRequester) {
          WebPushNotifications.sendJobAwaitingRequesterConfirmCompletionText(
            requesterPushNotSubscription,
            {
              requestTitle: jobDisplayName,
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

  taskerDisputesJob: async ({ jobId, reason, details }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedJob = await JobModel.findOneAndUpdate(
          { _id: jobId },
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
          jobDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          allowedToEmailTasker,
          processedPayment,
        } = await getAllContactDetails(jobId);

        sendGridEmailing.informBobCrewAboutDispute({
          whoSubmitted: 'Tasker',
          requesterDisplayName,
          taskerDisplayName,
          jobDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          jobId: updatedJob._id,
          reason,
          details,
          userIdWhoFiledDispute: taskerId,
          processedPayment, //xxx think if this is risky to be floating around
        });

        if (allowedToEmailTasker) {
          sendGridEmailing.tellDisputeOwnerThatWeWillInvestigate({
            to: taskerEmailAddress,
            requestTitle: jobDisplayName,
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

  requesterDisputesJob: async ({ jobId, reason, details }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedJob = await JobModel.findOneAndUpdate(
          { _id: jobId },
          {
            $set: {
              'dispute.proposerDispute': {
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

        if (!updatedJob || !updatedJob._id || updatedJob.state !== 'DISPUTED') {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated job taskerDisputesJob',
          });
        }

        const {
          requesterId,
          requesterDisplayName,
          taskerDisplayName,
          jobDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          allowedToEmailRequester,
          processedPayment,
        } = await getAllContactDetails(jobId);

        // send communication to both about the cancellation
        if (allowedToEmailRequester) {
          sendGridEmailing.tellDisputeOwnerThatWeWillInvestigate({
            to: requesterEmailAddress,
            requestTitle: jobDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }

        sendGridEmailing.informBobCrewAboutDispute({
          whoSubmitted: 'Requester',
          requesterDisplayName,
          taskerDisplayName,
          jobDisplayName,
          requestLinkForRequester,
          requestLinkForTasker,
          requesterEmailAddress,
          requesterPhoneNumber,
          taskerEmailAddress,
          jobId: updatedJob._id,
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
  cancelJob(jobId, mongoUser_id) {
    /**
     *
     * What we want to accomplish here
     *  - if job is open state
     *       update job status to CANCELED_OPEN
     *
     *  - if job is in Awarded state :
     *      - refund 80% to requester
     *      - 10% to Tasker
     *      - 10% to our platform
     *
     *
     *      - update JOB status to AWARDED_JOB_CANCELED_BY_REQUESTER
     *      - update JOB with the refund charge field on the job with the refund details
     *
     *      - find the AWARDED BID and switch its status to AWARDED_BID_CANCELED_BY_REQUESTER
     *
     *      - Update Requester User rating
     *                globalRating - 0.25 star
     *                totalOfAllRatings - 0.25
     *                numberOfTimesBeenRated + 1
     *                canceledJobs+ 1
     *
     *
     *
     *  - finally push notify to both informing them of this and emphasize to Tasker
     * that they should go place more bids
     *
     */
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        const job = await JobModel.findOne({ _id: jobId, _ownerRef: mongoUser_id }).exec();

        if (!job || !job._id || !job._ownerRef._id || !job.state) {
          return reject('Error while canceling job. contact us at bidorboo@bidorboo.ca');
        }

        // if we are cancelling an open job
        if (job.state === 'OPEN') {
          await job.remove();
          resolve();
        }

        // if we are cancelling an awardedJob
        else if (job.state === 'AWARDED' || job.state === 'AWARDED_SEEN') {
          // CANCELED_BY_REQUESTER_AWARDED case
          const {
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
          } = await getAllContactDetails(jobId);

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
              requestedJobId,
              awardedBidId,
              note: 'requester cancelled an awarded request',
            },
          });

          if (refundCharge.status === 'succeeded') {
            const [updatedJob] = await Promise.all([
              JobModel.findOneAndUpdate(
                { _id: jobId, _ownerRef: mongoUser_id },
                {
                  $set: {
                    state: 'AWARDED_JOB_CANCELED_BY_REQUESTER',
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
                    'rating.canceledJobs': jobId,
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
              sendGridEmailing.tellRequeterThatTheyHaveCancelledAnAwardedJob({
                to: requesterEmailAddress,
                requestTitle: jobDisplayName,
                toDisplayName: requesterDisplayName,
                linkForOwner: requestLinkForRequester,
              });
            }
            if (allowedToEmailTasker) {
              sendGridEmailing.tellTaskerThatRequesterCancelledJob({
                to: taskerEmailAddress,
                requestTitle: jobDisplayName,
                toDisplayName: taskerDisplayName,
                linkForTasker: requestLinkForTasker,
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

            resolve(updatedJob);
          } else {
            reject({
              refund: refundCharge,
              errorMsg: 'refund status failed. bidorboo will get in touch',
            });
          }
        }
        // not open nor awarded job
        reject('something went wrong while canceling job');
      } catch (e) {
        reject(e);
      }
    });
  },

  cancelAwardedJob: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'CANCELED_AWARDED');
  },

  expireOpenJob: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'EXPIRED_OPEN');
  },

  expireAwardedJob: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'EXPIRED_AWARDED');
  },

  setDisputedJob: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'DISPUTED');
  },
  setJobIsDone: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'DONE');
  },
  setJobIsPaidOut: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'PAIDOUT');
  },

  setRescheduleRequested: async (jobId, mongoUser_id, newDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        await JobModel.findOneAndUpdate(
          { _id: jobId, _ownerRef: mongoUser_id },
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

  _updateJobStatus: async (jobId, mongoUser_id, status) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        await JobModel.findOneAndUpdate(
          { _id: jobId, _ownerRef: mongoUser_id },
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
  updateLatestCheckoutSession: async (jobId, mongoUser_id, sessionClientId) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job

        await JobModel.findOne({ _id: jobId, _ownerRef: mongoUser_id }, async (err, jobDoc) => {
          if (err) {
            return reject(err);
          }
          jobDoc.latestCheckoutSession = sessionClientId;
          await jobDoc.save();
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  updateJobById: async (jobId, updateDetails) => {
    return new Promise(async (resolve, reject) => {
      try {
        await JobModel.findByIdAndUpdate(jobId, {
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

  deleteJob: async (jobId, mongoUser_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        const job = await JobModel.findOne({ _id: jobId, _ownerRef: mongoUser_id })
          .populate({
            path: '_bidsListRef',
            select: { _id: 1, _taskerRef: 1 },
            populate: {
              path: '_taskerRef',
            },
          })
          .lean(true)
          .exec();

        const areThereAnyBids = job._bidsListRef && job._bidsListRef.length > 0;
        if (areThereAnyBids) {
          bidsIds = [];
          taskersIds = [];
          job._bidsListRef.forEach((bidRef) => {
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
          { _id: job._ownerRef.toString() },
          { $pull: { _postedJobsRef: { $in: [job._id] } } },
          { new: true }
        )
          .lean(true)
          .exec();

        await JobModel.deleteOne({ _id: job._id.toString() })
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
    return JobModel.find(
      { _ownerRef: { $eq: _id } },
      {
        _bidsListRef: 1,
        _awardedBidRef: 1,
        state: 1,
        templateId: 1,
        _reviewRef: 1,
        taskerConfirmedCompletion: 1,
        jobTitle: 1,
        startingDateAndTime: 1,
        taskImages: 1,
        dispute: 1,
        completionDate: 1,
      },
      { limit: 500, sort: { startingDateAndTime: 1 } }
    )
      .populate({
        path: '_reviewRef',
        select: {
          proposerReview: 0,
          taskerReview: 0,
        },
      })
      .populate({
        path: '_awardedBidRef',
        select: {
          isNewBid: 1,
        },
      })
      .lean({ virtuals: true })
      .exec();
  },

  // everything below this line is great --------------------
  jobToBidOnDetailsForTasker: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobWithBidDetails = await JobModel.findOne(
          { _id: jobId },
          {
            _ownerRef: 1,
            _bidsListRef: 1,
            title: 1,
            state: 1,
            viewedBy: 1,
            detailedDescription: 1,
            jobTitle: 1,
            location: 1,
            startingDateAndTime: 1,
            durationOfJob: 1,
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

        const hasBids = jobWithBidDetails._bidsListRef && jobWithBidDetails._bidsListRef.length > 0;
        if (hasBids) {
          const bidsList = jobWithBidDetails._bidsListRef;
          // add avgBid property
          const bidsTotal = bidsList
            .map((bid) => bid.bidAmount.value)
            .reduce((accumulator, bidAmount) => accumulator + bidAmount);
          jobWithBidDetails.avgBid = `${Math.ceil(bidsTotal / bidsList.length)}`;

          // remove any personal identifying info about other taskers
          const cleanBidsList = bidsList.map((bid) => ({ ...bid, bidAmount: {} }));
          jobWithBidDetails._bidsListRef = cleanBidsList;
        } else {
          jobWithBidDetails.avgBid = `--`;
        }

        resolve(jobWithBidDetails);
      } catch (e) {
        reject(e);
      }
    });
  },

  getArchivedTaskDetailsForRequester: async ({ mongoUser_id, jobId }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const archivedJobDetails = await JobModel.findOne(
          { _id: jobId, _ownerRef: { $eq: mongoUser_id } },
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

        if (archivedJobDetails && archivedJobDetails._id) {
          if (
            !(
              archivedJobDetails._reviewRef &&
              archivedJobDetails._reviewRef.proposerReview &&
              archivedJobDetails._reviewRef.taskerReview
            )
          ) {
            archivedJobDetails._reviewRef.taskerReview = null;
          }
          return resolve(archivedJobDetails);
        }
        reject('cant find the specified Request');
      } catch (e) {
        reject(e);
      }
    });
  },

  getAwardedJobFullDetailsForRequester: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobWithTaskerDetails = await JobModel.findOne(
          { _id: jobId },
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
              select: {
                proposerReview: 0,
                taskerReview: 0,
              },
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
          .lean({ virtuals: true })
          .exec();

        resolve(jobWithTaskerDetails);
      } catch (e) {
        reject(e);
      }
    });
  },

  postedJobAndBidsForRequester: async (mongDbUserId, jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobWithBidDetails = await JobModel.findOne({ _id: jobId, _ownerRef: mongDbUserId })
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
                _jobRef: 1,
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

        resolve(jobWithBidDetails);
      } catch (e) {
        reject(e);
      }
    });
  },
};
