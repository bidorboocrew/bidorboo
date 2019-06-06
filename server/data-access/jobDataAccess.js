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

const schemaHelpers = require('./util_schemaPopulateProjectHelpers');
const stripeServiceUtil = require('../services/stripeService').util;

const BIDORBOO_REFUND_AMOUNT = 0.8;
const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedJobOwnerBidderAndRelevantNotificationDetails;
exports.jobDataAccess = {
  BidOrBooAdmin: {
    SendRemindersForUpcomingJobs: async () => {
      const today = moment()
        .tz('America/Toronto')
        .startOf('day')
        .toISOString();

      const theNext24Hours = moment()
        .tz('America/Toronto')
        .add(1, 'day')
        .startOf('day')
        .toISOString();

      await JobModel.find({
        $and: [{ _awardedBidRef: { $exists: true } }, { startingDateAndTime: { $exists: true } }],
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
          select: { _bidderRef: 1 },
          populate: {
            path: '_bidderRef',
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
        .exec((err, res) => {
          if (err) {
            throw err;
          }
          if (res && res.length > 0) {
            res.forEach(async (job) => {
              const jobStartDate = job.startingDateAndTime;

              // normalize the start date to the same timezone to comapre
              const normalizedStartDate = moment(jobStartDate)
                .tz('America/Toronto')
                .toISOString();

              const isJobHappeningAfterToday = moment(normalizedStartDate).isAfter(today);
              const isJobHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(
                theNext24Hours
              );
              if (isJobHappeningAfterToday && isJobHappeningBeforeTomorrow) {
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
                const linkForOwner = ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId);
                const awardedBidderDetails = job._awardedBidRef._bidderRef;
                const bidderEmailAddress =
                  awardedBidderDetails.email && awardedBidderDetails.email.emailAddress
                    ? awardedBidderDetails.email.emailAddress
                    : '';
                const bidderPhoneNumber =
                  awardedBidderDetails.phone && awardedBidderDetails.phone.phoneNumber
                    ? awardedBidderDetails.phone.phoneNumber
                    : '';
                const linkForBidder = ROUTES.CLIENT.BIDDER.dynamicCurrentAwardedBid(awardedBidId);
                if (ownerDetails.notifications && ownerDetails.notifications.email) {
                  sendGridEmailing.sendJobIsHappeningSoonToRequesterEmail({
                    to: ownerEmailAddress,
                    requestTitle: job.fromTemplateId,
                    toDisplayName: `${ownerDetails.displayName}`,
                    bidderEmailAddress,
                    bidderPhoneNumber,
                    linkForOwner,
                  });
                }
                if (
                  awardedBidderDetails.notifications &&
                  awardedBidderDetails.notifications.email
                ) {
                  sendGridEmailing.sendJobIsHappeningSoonToTaskerEmail({
                    to: bidderEmailAddress,
                    requestTitle: job.fromTemplateId,
                    toDisplayName: `${awardedBidderDetails.displayName}`,
                    ownerEmailAddress,
                    ownerPhoneNumber,
                    linkForBidder,
                  });
                }

                if (
                  ownerPhoneNumber &&
                  ownerDetails.notifications &&
                  ownerDetails.notifications.text
                ) {
                  sendTextService.sendJobIsHappeningSoonText(
                    ownerPhoneNumber,
                    job.fromTemplateId,
                    linkForOwner
                  );
                }
                if (
                  bidderPhoneNumber &&
                  awardedBidderDetails.notifications &&
                  awardedBidderDetails.notifications.text
                ) {
                  sendTextService.sendJobIsHappeningSoonText(
                    bidderPhoneNumber,
                    job.fromTemplateId,
                    linkForBidder
                  );
                }

                if (ownerDetails.notifications && ownerDetails.notifications.push) {
                  WebPushNotifications.pushJobIsHappeningSoon(ownerDetails.pushSubscription, {
                    requestTitle: job.fromTemplateId,
                    urlToLaunch: linkForOwner,
                  });
                }
                if (awardedBidderDetails.notifications && awardedBidderDetails.notifications.push) {
                  WebPushNotifications.pushJobIsHappeningSoon(
                    awardedBidderDetails.pushSubscription,
                    {
                      requestTitle: job.fromTemplateId,
                      urlToLaunch: linkForBidder,
                    }
                  );
                }
              }
            });
          }
        });
      return;
    },
    CleanUpAllExpiredJobs: async () => {
      const today = moment()
        .tz('America/Toronto')
        .startOf('day')
        .toISOString();

      await JobModel.find({
        startingDateAndTime: { $exists: true },
        _awardedBidRef: { $exists: false },
      })
        .populate({
          path: '_bidsListRef',
          select: { _id: 1, _bidderRef: 1 },
          populate: {
            path: '_bidderRef',
          },
        })
        .lean({ virtuals: true })
        .exec((err, res) => {
          if (err) {
            throw err;
          }

          if (res && res.length > 0) {
            res.forEach(async (job) => {
              const jobStartDate = job.startingDateAndTime;

              // normalize the start date to the same timezone to comapre
              const normalizedStartDate = moment(jobStartDate)
                .tz('America/Toronto')
                .toISOString();

              const isJobPastDue = moment(normalizedStartDate).isBefore(today);

              if (isJobPastDue) {
                const areThereAnyBids = job._bidsListRef && job._bidsListRef.length > 0;
                if (areThereAnyBids) {
                  bidsIds = [];
                  biddersIds = [];
                  job._bidsListRef.forEach((bidRef) => {
                    bidsIds.push(bidRef._id.toString());
                    biddersIds.push(bidRef._bidderRef._id.toString());
                  });

                  biddersIds.forEach(async (bidderId) => {
                    // clean ref for bidders
                    await User.findOneAndUpdate(
                      { _id: bidderId },
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
                  .lean(true)
                  .exec();
              }
            });
          }
        });

      return;
    },
  },

  // get jobs for a user and filter by a given state
  getUserAwardedJobs: async (userId) => {
    return User.findOne({ userId: userId }, { _postedJobsRef: 1 })
      .populate({
        path: '_postedJobsRef',
        select: {
          addressText: 1,
          fromTemplateId: 1,
          startingDateAndTime: 1,
          _awardedBidRef: 1,
          createdAt: 1,
          _reviewRef: 1,
          _id: 1,
          jobCompletion: 1,
        },
        match: {
          state: { $eq: 'AWARDED' },
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
                displayName: 1,
                email: 1,
                phone: 1,
                profileImage: 1,
                rating: 1,
                userId: 1,
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
              userId: 1,
            },
          },
        ],
      })
      .lean({ virtuals: true })
      .exec();
  },

  // get jobs for a user and filter by a given state
  getAllRequestsByUserId: async (userId) => {
    return User.findOne({ userId: userId }, { _postedJobsRef: 1 })
      .populate({
        path: '_postedJobsRef',
        select: {
          booedBy: 0,
          processedPayment: 0,
          updatedAt: 0,
          viewedBy: 0,
          hideFrom: 0,
          createdAt: 0,
        },
        options: { sort: { startingDateAndTime: 1 } },
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
            path: '_awardedBidRef',
            model: 'BidModel',
            select: {
              _bidderRef: 1,
              isNewBid: 1,
              state: 1,
              bidAmount: 1,
            },
            populate: {
              path: '_bidderRef',
              select: {
                displayName: 1,
                email: 1,
                phone: 1,
                profileImage: 1,
                rating: 1,
                userId: 1,
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
              userId: 1,
            },
          },
        ],
      })
      .lean({ virtuals: true })
      .exec();
  },

  // get jobs for a user and filter by a given state
  getUserJobsByState: async (userId, stateFilter) => {
    return User.findOne({ userId: userId }, { _postedJobsRef: 1 })
      .populate({
        path: '_postedJobsRef',
        select: schemaHelpers.JobFull,
        match: { state: { $eq: stateFilter } },
        options: { sort: { startingDateAndTime: 1 } },
      })
      .lean(true)
      .exec();
  },
  getJobById: (jobId) => {
    return JobModel.findById(jobId)
      .populate({ path: '_bidsListRef', select: { _bidderRef: 1 } })
      .lean({ virtuals: true })
      .exec();
  },
  getJobWithReviewModel: async (jobId, ownerId) => {
    return JobModel.findOne({ _id: jobId, _ownerRef: ownerId })
      .populate({ path: '_reviewRef' })
      .lean({ virtuals: true })
      .exec();
  },

  kickStartReviewModel: async ({ jobId, bidderId, proposerId }) => {
    const kickStartReviewModel = await new ReviewModel({
      jobId,
      bidderId,
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
  getJobWithBidDetails: async (mongDbUserId, jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobWithBidDetails = await JobModel.findOne(
          { _id: jobId, _ownerRef: mongDbUserId },
          { ...schemaHelpers.JobFull }
        )
          .populate([
            {
              path: '_ownerRef',
              select: {
                displayName: 1,
                profileImage: 1,
                rating: 1,
                _id: 1,
                notifications: 1,
              },
            },
            {
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
                  displayName: 1,
                  email: 1,
                  phone: 1,
                  profileImage: 1,
                  rating: 1,
                  userId: 1,
                },
              },
            },
            {
              path: '_bidsListRef',
              select: { _bidderRef: 1, isNewBid: 1, bidAmount: 1, _jobRef: 1 },
              populate: {
                path: '_bidderRef',
                select: {
                  isGmailUser: 1,
                  isFbUser: 1,
                  displayName: 1,
                  profileImage: 1,
                  membershipStatus: 1,
                  rating: 1,
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

  getJobToBidOnDetails: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobOwnerFields = {
          displayName: 1,
          profileImage: 1,
          _id: 1,
          rating: 1,
        };

        const jobWithBidDetails = await JobModel.findOne(
          { _id: jobId },
          {
            _ownerRef: 1,
            _bidsListRef: 1,
            title: 1,
            state: 1,
            viewedBy: 1,
            detailedDescription: 1,
            location: 1,
            startingDateAndTime: 1,
            durationOfJob: 1,
            fromTemplateId: 1,
            extras: 1,
          }
        )
          .populate([
            { path: '_ownerRef', select: jobOwnerFields },
            { path: '_bidsListRef', select: { bidAmount: 1 } },
          ])
          .lean({ virtuals: true })
          .exec();

        resolve(jobWithBidDetails);
      } catch (e) {
        reject(e);
      }
    });
  },
  getMyPostedJobs: async (userId, jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allJobs = await User.findOne({ userId: userId }, { _postedJobsRef: 1 })
          .populate({
            path: '_postedJobsRef',
            select: schemaHelpers.JobFull,
            options: { sort: { startingDateAndTime: 1 } },
            populate: {
              path: '_bidsListRef',
              select: schemaHelpers.BidFull,
              populate: {
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
      .lean({ virtuals: true })
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
      .lean({ virtuals: true })
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
  getAwardedJobDetails: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobWithBidderDetails = await JobModel.findById({ _id: jobId })
          .populate([
            {
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
                  displayName: 1,
                  email: 1,
                  phone: 1,
                  profileImage: 1,
                  rating: 1,
                  userId: 1,
                },
              },
            },
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

        resolve(jobWithBidderDetails);
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
            fromTemplateId: 1,
            startingDateAndTime: 1,
            extras: 1,
            state: 1,
            location: 1,
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
            select: { _bidderRef: 1, bidAmount: 1 },
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
            fromTemplateId: 1,
            startingDateAndTime: 1,
            extras: 1,
            state: 1,
            location: 1,
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
            select: { _bidderRef: 1, bidAmount: 1 },
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
  getJobsNear: ({ location, searchRadius = 25000 }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let searchQuery = {
          state: { $eq: 'OPEN' },
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
        const results = await JobModel.find(
          searchQuery,
          {
            _ownerRef: 1,
            fromTemplateId: 1,
            startingDateAndTime: 1,
            extras: 1,
            state: 1,
            location: 1,
            _bidsListRef: 1,
          },
          { lean: { virtuals: true } }
        )
          .sort({ startingDateAndTime: 1 })
          .populate([
            {
              path: '_ownerRef',
              select: { displayName: 1, profileImage: 1, _id: 1, rating: 1 },
              options: { lean: { virtuals: true } },
            },
            {
              path: '_bidsListRef',
              select: { _bidderRef: 1, bidAmount: 1 },
              options: { lean: { virtuals: true } },
            },
          ]);
        return resolve(results);
        // let aggregateSearchQuery = {
        //   $geoNear: {
        //     near: {
        //       type: 'Point',
        //       coordinates: [location.lng, location.lat],
        //     },
        //     distanceField: 'dist.calculated',
        //     includeLocs: 'dist.location',
        //     // limit: 50,
        //     distanceMultiplier: 1 / 1000, //meters
        //     maxDistance: searchRadius * 1000, //meters
        //     spherical: true,
        //     uniqueDocs: true,
        //   },
        // };
        // if (selectedTemplateIds && selectedTemplateIds.length > 0) {
        //   //filter categories of jobs
        //   aggregateSearchQuery.$geoNear.query = {
        //     fromTemplateId: { $in: selectedTemplateIds },
        //     state: { $eq: 'OPEN' },
        //   };
        // }
        // JobModel.aggregate(
        //   [
        //     aggregateSearchQuery,
        //     {
        //       $project: {
        //         _ownerRef: 1,
        //         fromTemplateId: 1,
        //         startingDateAndTime: 1,
        //         extras: 1,
        //         state: 1,
        //         location: 1,
        //         _bidsListRef: 1,
        //       },
        //     },
        //   ],
        //   async (error, results) => {
        //     //populate job fields
        //     if (error) {
        //       return reject(error);
        //     } else if (results && results.length > 0) {
        //       await Promise.all([
        //         User.populate(results, {
        //           path: '_ownerRef',
        //           select: { displayName: 1, profileImage: 1, _id: 1, rating: 1 },
        //           options: { lean: { virtuals: true } },
        //         }),
        //         BidModel.populate(results, {
        //           path: '_bidsListRef',
        //           select: { _bidderRef: 1, bidAmount: 1 },
        //           options: { lean: { virtuals: true } },
        //         }),
        //       ]);
        //       return resolve(results);
        //     } else {
        //       // no jobs found return empty set
        //       return resolve([]);
        //     }
        //   }
        // ).sort({ startingDateAndTime: 1, allowDiskUse: true });
        // .explain();
      } catch (e) {
        reject(e);
      }
    });
  },

  updateJobAwardedBid: async (jobId, bidId, processedPaymentDetails) => {
    return Promise.all([
      BidModel.findOneAndUpdate(
        { _id: bidId },
        {
          $set: { state: 'WON' },
        }
      )
        .lean(true)
        .exec(),
      JobModel.findOneAndUpdate(
        { _id: jobId },
        {
          $set: {
            _awardedBidRef: bidId,
            state: 'AWARDED',
            processedPayment: { ...processedPaymentDetails },
          },
        }
      )
        .lean({ virtuals: true })
        .exec(),
    ]);
  },

  awardBidder: async (jobId, bidId) => {
    const updateRelevantItems = await Promise.all([
      BidModel.findOneAndUpdate(
        { _id: bidId },
        {
          $set: { state: 'WON' },
        }
      )
        .lean(true)
        .exec(),
      JobModel.findOneAndUpdate(
        { _id: jobId },
        {
          $set: { _awardedBidRef: bidId, state: 'AWARDED' },
        }
      )
        .lean({ virtuals: true })
        .exec(),
    ]);

    return JobModel.findOne(
      { _id: jobId },
      {
        addressText: 0,
        updatedAt: 0,
        jobReview: 0,
        extras: 0,
        properties: 0,
        __v: 0,
        _bidsListRef: 0,
        whoSeenThis: 0,
        _ownerRef: 0,
        ownerId: 0,
        bidderIds: 0,
        hideForUserIds: 0,
      }
    )
      .populate({
        path: '_awardedBidRef',
        select: {
          _jobRef: 0,
        },
        populate: {
          path: '_bidderRef',
          select: {
            _postedJobsRef: 0,
            _postedBidsRef: 0,
            userRole: 0,
            extras: 0,
            settings: 0,
            creditCards: 0,
            updatedAt: 0,
            __v: 0,
            verificationIdImage: 0,
          },
        },
      })

      .lean({ virtuals: true })
      .exec();
  },
  findOneByJobId: (id) => {
    return JobModel.findOne({ _id: id })
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
  isAwardedBidder: (mongoUser_id, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _awardedBidRef: 1 })
      .populate({
        path: '_awardedBidRef',
        select: {
          _bidderRef: 1,
        },
        populate: {
          path: '_bidderRef',
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

  requesterConfirmsJobCompletion: async (jobId) => {
    // if tasker didnt
    return new Promise(async (resolve, reject) => {
      try {
        const updatedJob = await JobModel.findOneAndUpdate(
          { _id: jobId },
          {
            $set: { 'jobCompletion.proposerConfirmed': true, state: 'DONE' },
          },
          { new: true }
        )
          .lean()
          .exec();

        if (
          !updatedJob ||
          !updatedJob._id ||
          !updatedJob.jobCompletion.proposerConfirmed ||
          !updatedJob._awardedBidRef ||
          !updatedJob._ownerRef ||
          !updatedJob.processedPayment ||
          updatedJob.state !== 'DONE'
        ) {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated job requesterConfirmed',
          });
        }

        const updatedAwardedBid = await BidModel.findByIdAndUpdate(
          updatedJob._awardedBidRef,
          {
            $set: { state: 'DONE' },
          },
          { new: true }
        )
          .lean()
          .exec();

        if (
          !updatedAwardedBid ||
          !updatedAwardedBid._id ||
          !updatedAwardedBid._bidderRef ||
          updatedAwardedBid.state !== 'DONE'
        ) {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated awarded bid requesterConfirmed',
          });
        }
        // update stuff
        const [updatedTasker, updatedRequester] = await Promise.all([
          User.findByIdAndUpdate(
            updatedAwardedBid._bidderRef,
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

        if (updatedTasker && updatedTasker.stripeConnect && updatedTasker.stripeConnect.accId) {
          //xxx
          // this has to happen via cron job + webhook only do this when payment is available for payout
          // const payoutInititated = await stripeServiceUtil.payoutToBank(
          //   updatedTasker.stripeConnect.accId,
          //   {
          //     amount: processedPayment.bidderPayout,
          //     metadata: {
          //       requesterId,
          //       requesterEmailAddress,
          //       taskerId,
          //       taskerEmailAddress,
          //       requestedJobId,
          //       awardedBidId,
          //       note: 'Task Was Completed Successfully',
          //     },
          //   }
          // );

          // if (payoutInititated.status === 'succeeded') {
          if (true) {
            // xxxxxxxxxxxxxx replace with review links

            // begin communication
            // send communication to both about the cancellation
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
                linkForBidder: requestLinkForTasker,
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
          } else {
            // xxxxxx log to our "dispute DB"
            reject({
              success: false,
              ErrorMsg:
                'failed to submit payout to bidder, but dont worry, BidOrBooCrew will handle this and ensure the Tasker is paid asap',
            });
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  bidderConfirmsJobCompletion: async (jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedJob = await JobModel.findOneAndUpdate(
          { _id: jobId },
          {
            $set: { 'jobCompletion.bidderConfirmed': true },
          },
          { new: true }
        )
          .lean({ virtuals: true })
          .exec();

        if (!updatedJob || !updatedJob._id || !updatedJob.jobCompletion.bidderConfirmed) {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated job bidderConfirmed',
          });
        }

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
            linkForBidder: requestLinkForTasker,
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
          .lean({ virtuals: true })
          .exec();

        if (!updatedJob || !updatedJob._id || updatedJob.state !== 'DISPUTED') {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated job bidderDisputesJob',
          });
        }

        const {
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
            linkForBidder: requestLinkForTasker,
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
          .lean({ virtuals: true })
          .exec();

        if (!updatedJob || !updatedJob._id || updatedJob.state !== 'DISPUTED') {
          return reject({
            success: false,
            ErrorMsg: 'failed to update the associated job bidderDisputesJob',
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
          processedPayment
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
     *      - update JOB status to AWARDED_CANCELED_BY_REQUESTER
     *      - update JOB with the refund charge field on the job with the refund details
     *
     *      - find the AWARDED BID and switch its status to CANCELED_AWARDED_BY_REQUESTER
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
        const job = await JobModel.findOne({ _id: jobId, _ownerRef: mongoUser_id })
          .lean({ virtuals: true })
          .exec();

        if (!job || !job._id || !job._ownerRef._id || !job.state) {
          return reject('Error while canceling job. contact us at bidorboocrew@gmail.com');
        }

        // if we are cancelling an open job
        if (job.state === 'OPEN') {
          const updatedJob = await JobModel.findOneAndUpdate(
            { _id: job._id, _ownerRef: mongoUser_id },
            {
              $set: { state: 'CANCELED_OPEN' },
            },
            { new: true }
          );
          resolve(updatedJob);
        }

        // if we are cancelling an awardedJob
        else if (job.state === 'AWARDED') {
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

          const refundCharge = await stripeServiceUtil.partialRefundTransation({
            chargeId: processedPayment.chargeId,
            refundAmount: processedPayment.amount * BIDORBOO_REFUND_AMOUNT,
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
            const [updatedJob, updatedBid, updatedRequester] = await Promise.all([
              JobModel.findOneAndUpdate(
                { _id: jobId, _ownerRef: mongoUser_id },
                {
                  $set: {
                    state: 'AWARDED_CANCELED_BY_REQUESTER',
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
              BidModel.findByIdAndUpdate(
                awardedBidId,
                {
                  $set: { state: 'CANCELED_AWARDED_BY_REQUESTER' },
                },
                { new: true }
              )
                .lean(true)
                .exec(),
              User.findOneAndUpdate(
                { _id: mongoUser_id },
                {
                  $push: { 'rating.canceledJobs': jobId },
                  $inc: {
                    'rating.globalRating': -0.25,
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

            // -------------------------------- assert things
            if (
              !updatedJob._id ||
              !updatedJob.processedPayment.refund ||
              updatedJob.state === 'AWARDED_CANCELED_BY_REQUESTER'
            ) {
              return reject({ success: false, ErrorMsg: 'failed to update the associated job' });
            }

            if (!updatedBid._id || updatedBid.state !== 'CANCELED_AWARDED_BY_REQUESTER') {
              return reject({ success: false, ErrorMsg: 'failed to update the associated bid' });
            }

            if (
              !updatedRequester._id ||
              !updatedRequester.rating ||
              !updatedRequester.rating.canceledJobs ||
              !updatedRequester.rating.canceledJobs.length > 0
            ) {
              const addedThisToCanceledJobs = updatedRequester.rating.canceledJobs.some(
                (canceledJob) => {
                  return canceledJob.toString() === requestedJobId.toString();
                }
              );
              if (!addedThisToCanceledJobs) {
                return reject({
                  success: false,
                  ErrorMsg: 'failed to update the associated Tasker',
                });
              }
            }

            resolve(updatedJob);
          } else {
            reject({
              refund: refundCharge,
              errorMsg: 'refund status failed. bidorboocrew will get in touch',
            });
          }
        }
        // not open nor awarded job
        resolve({});
      } catch (e) {
        reject(e);
      }
    });
  },

  // _getAwardedJobOwnerBidderAndRelevantNotificationDetails: async (jobId) => {
  //   const awardedJob = await JobModel.findById(jobId)
  //     .populate({
  //       path: '_awardedBidRef',
  //       select: {
  //         _bidderRef: 1,
  //         isNewBid: 1,
  //         state: 1,
  //         bidAmount: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //       },
  //       populate: {
  //         path: '_bidderRef',
  //         select: {
  //           _id: 1,
  //           email: 1,
  //           phone: 1,
  //           pushSubscription: 1,
  //           notifications: 1,
  //           displayName: 1,
  //         },
  //       },
  //     })
  //     .populate({
  //       path: '_ownerRef',
  //       select: {
  //         _id: 1,
  //         displayName: 1,
  //         email: 1,
  //         phone: 1,
  //         pushSubscription: 1,
  //         notifications: 1,
  //       },
  //     })
  //     .lean({ virtuals: true })
  //     .exec();

  //   const { _ownerRef, _awardedBidRef, processedPayment, displayTitle } = awardedJob;
  //   const awardedBidId = _awardedBidRef._id.toString();
  //   const requestedJobId = awardedJob._id.toString();

  //   const ownerDetails = _ownerRef;
  //   const awardedBidderDetails = _awardedBidRef._bidderRef;

  //   const requesterId = _ownerRef._id.toString();
  //   const taskerId = awardedBidderDetails._id.toString();

  //   const requesterDisplayName = ownerDetails.displayName;
  //   const taskerDisplayName = awardedBidderDetails.displayName;
  //   const jobDisplayName = displayTitle || awardedJob.jobTitle || awardedJob.fromTemplateId;

  //   const requestLinkForRequester = ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId);
  //   const requestLinkForTasker = ROUTES.CLIENT.BIDDER.dynamicCurrentAwardedBid(awardedBidId);

  //   const requesterPushNotSubscription = ownerDetails.pushSubscription;
  //   const taskerPushNotSubscription = awardedBidderDetails.pushSubscription;

  //   const requesterEmailAddress =
  //     ownerDetails.email && ownerDetails.email.emailAddress ? ownerDetails.email.emailAddress : '';
  //   const requesterPhoneNumber =
  //     ownerDetails.phone && ownerDetails.phone.phoneNumber ? ownerDetails.phone.phoneNumber : '';

  //   const taskerEmailAddress =
  //     awardedBidderDetails.email && awardedBidderDetails.email.emailAddress
  //       ? awardedBidderDetails.email.emailAddress
  //       : '';
  //   const taskerPhoneNumber =
  //     awardedBidderDetails.phone && awardedBidderDetails.phone.phoneNumber
  //       ? awardedBidderDetails.phone.phoneNumber
  //       : '';

  //   const allowedToEmailRequester = ownerDetails.notifications && ownerDetails.notifications.email;
  //   const allowedToEmailTasker =
  //     awardedBidderDetails.notifications && awardedBidderDetails.notifications.email;

  //   const allowedToTextRequester = ownerDetails.notifications && ownerDetails.notifications.text;
  //   const allowedToTextTasker =
  //     awardedBidderDetails.notifications && awardedBidderDetails.notifications.text;

  //   const allowedToPushNotifyRequester =
  //     ownerDetails.notifications && ownerDetails.notifications.push;
  //   const allowedToPushNotifyTasker =
  //     awardedBidderDetails.notifications && awardedBidderDetails.notifications.push;

  //   return {
  //     requestedJobId,
  //     awardedBidId,
  //     requesterId,
  //     taskerId,
  //     requesterDisplayName,
  //     taskerDisplayName,
  //     jobDisplayName,
  //     requestLinkForRequester,
  //     requestLinkForTasker,
  //     requesterEmailAddress,
  //     requesterPhoneNumber,
  //     taskerEmailAddress,
  //     taskerPhoneNumber,
  //     allowedToEmailRequester,
  //     allowedToEmailTasker,
  //     allowedToTextRequester,
  //     allowedToTextTasker,
  //     allowedToPushNotifyRequester,
  //     allowedToPushNotifyTasker,
  //     requesterPushNotSubscription,
  //     taskerPushNotSubscription,
  //     processedPayment,
  //   };
  // },
  cancelOpenJob: async (jobId, mongoUser_id) => {
    return _updateJobStatus(jobId, mongoUser_id, 'CANCELED_OPEN');
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

  deleteJob: async (jobId, mongoUser_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        const job = await JobModel.findOne({ _id: jobId, _ownerRef: mongoUser_id })
          .populate({
            path: '_bidsListRef',
            select: { _id: 1, _bidderRef: 1 },
            populate: {
              path: '_bidderRef',
            },
          })
          .lean(true)
          .exec();

        const areThereAnyBids = job._bidsListRef && job._bidsListRef.length > 0;
        if (areThereAnyBids) {
          bidsIds = [];
          biddersIds = [];
          job._bidsListRef.forEach((bidRef) => {
            bidsIds.push(bidRef._id.toString());
            biddersIds.push(bidRef._bidderRef._id.toString());
          });

          biddersIds.forEach(async (bidderId) => {
            // clean ref for bidders
            await User.findOneAndUpdate(
              { _id: bidderId },
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
};
