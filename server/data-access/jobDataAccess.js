//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');
const ReviewModel = mongoose.model('ReviewModel');

const moment = require('moment');
const ROUTES = require('../backend-route-constants');
const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/BlowerTxt').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const schemaHelpers = require('./util_schemaPopulateProjectHelpers');

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
            email: 1,
            phone: 1,
            _bidderRef: 1,
            pushSubscription: 1,
            notifications: 1,
          },
        })
        .populate({
          path: '_awardedBidRef',
          select: { _bidderRef: 1 },
          populate: {
            path: '_bidderRef',
            select: { _id: 1, email: 1, phone: 1, pushSubscription: 1, notifications: 1 },
          },
        })
        .lean(true)
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
                const linkForOwner = `https://www.bidorboo.com${
                  ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage
                }/${jobId}`;
                const awardedBidderDetails = job._awardedBidRef._bidderRef;
                const bidderEmailAddress =
                  awardedBidderDetails.email && awardedBidderDetails.email.emailAddress
                    ? awardedBidderDetails.email.emailAddress
                    : '';
                const bidderPhoneNumber =
                  awardedBidderDetails.phone && awardedBidderDetails.phone.phoneNumber
                    ? awardedBidderDetails.phone.phoneNumber
                    : '';
                const linkForBidder = `https://www.bidorboo.com${
                  ROUTES.CLIENT.BIDDER.currentAwardedBid
                }/${awardedBidId}`;
                if (ownerDetails.notifications && ownerDetails.notifications.email) {
                  sendGridEmailing.sendEmail({
                    to: ownerEmailAddress,
                    subject: `BidOrBoo: ${job.fromTemplateId} is Scheduled to happen soon!`,
                    contentText: `This is an automated reminder for your upcoming scheduled ${
                      job.fromTemplateId
                    } task.
                  To get in touch with your tasker feel free to contact them on:
                  email address : ${bidderEmailAddress}
                  phone number : ${bidderPhoneNumber}
                  for reference here is the link to your task ${linkForOwner}
                   `,
                    toDisplayName: `${ownerDetails.displayName}`,
                    contentHtml: `This is an automated reminder for your upcoming scheduled ${
                      job.fromTemplateId
                    } task.
                  To get in touch with your tasker feel free to contact them on:
                  email address : ${bidderEmailAddress}
                  phone number : ${bidderPhoneNumber}`,
                    clickLink: `${linkForOwner}`,
                    clickDisplayName: `View This Task`,
                  });
                }
                if (
                  awardedBidderDetails.notifications &&
                  awardedBidderDetails.notifications.email
                ) {
                  sendGridEmailing.sendEmail({
                    to: bidderEmailAddress,
                    subject: `BidOrBoo: ${job.fromTemplateId} is Scheduled to happen soon!`,
                    contentText: `This is an automated reminder for your upcoming scheduled ${
                      job.fromTemplateId
                    } task.
                  To get in touch with your task owner feel free to contact them on:
                  email address : ${ownerEmailAddress}
                  phone number : ${ownerPhoneNumber}
                  for reference here is the link to your task ${linkForBidder}
                   `,
                    toDisplayName: `${awardedBidderDetails.displayName}`,
                    contentHtml: `This is an automated reminder for your upcoming scheduled ${
                      job.fromTemplateId
                    } task.
                  To get in touch with your task owner feel free to contact them on:
                  email address : ${ownerEmailAddress}
                  phone number : ${ownerPhoneNumber}`,
                    clickLink: `${linkForBidder}`,
                    clickDisplayName: `View This Task`,
                  });
                }

                if (
                  ownerPhoneNumber &&
                  ownerDetails.notifications &&
                  ownerDetails.notifications.phone
                ) {
                  await sendTextService.sendText(
                    ownerPhoneNumber,
                    `BidOrBoo: ${
                      job.fromTemplateId
                    } is happening soon! go to www.bidorboo.com for details`
                  );
                }
                if (
                  bidderPhoneNumber &&
                  awardedBidderDetails.notifications &&
                  awardedBidderDetails.notifications.phone
                ) {
                  await sendTextService.sendText(
                    bidderPhoneNumber,
                    `BidOrBoo: ${
                      job.fromTemplateId
                    } is happening soon! go to www.bidorboo.com for details`
                  );
                }
                if (ownerDetails.notifications && ownerDetails.notifications.push) {
                  WebPushNotifications.sendPush(ownerDetails.pushSubscription, {
                    title: `${job.fromTemplateId} is happening soon!`,
                    body: `click to view schedule and tasker details`,
                    urlToLaunch: `${linkForOwner}`,
                  });
                }
                if (awardedBidderDetails.notifications && awardedBidderDetails.notifications.push) {
                  WebPushNotifications.sendPush(awardedBidderDetails.pushSubscription, {
                    title: `BidOrBoo: reminder for ${job.fromTemplateId}`,
                    body: `It is happening soon ! . click for more details`,
                    urlToLaunch: `${linkForBidder}`,
                  });
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
        .lean(true)
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
        },
        match: {
          state: { $eq: 'AWARDED' },
          $or: [
            { _reviewRef: { $exists: false } },
            { '_reviewRef.proposerSubmitted': { $eq: false } },
          ],
        },
        options: { sort: { startingDateAndTime: 1 } },
        populate: {
          path: '_awardedBidRef',
          select: {
            _bidderRef: 1,
            bidAmount: 1,
          },
          populate: {
            path: '_bidderRef',
            select: {
              profileImage: 1,
              displayName: 1,
              rating: 1,
              notifications: 1,
            },
          },
        },
      })

      .lean(true)
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
      .lean(true)
      .exec();
  },
  getJobWithReviewModel: async (jobId) => {
    return JobModel.findById(jobId)
      .populate({ path: '_reviewRef' })
      .lean(true)
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
      }
    )
      .lean(true)
      .exec();
  },
  getJobWithBidDetails: async (mongDbUserId, jobId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobOwnerFields = {
          displayName: 1,
          profileImage: 1,
          _id: 1,
          rating: 1,
          notifications: 1,
        };

        const jobWithBidDetails = await JobModel.findOne(
          { _id: jobId, _ownerRef: mongDbUserId },
          { ...schemaHelpers.JobFull }
        )
          .populate({ path: '_ownerRef', select: jobOwnerFields })
          .populate({
            path: '_bidsListRef',
            select: schemaHelpers.BidFull,
            populate: {
              path: '_bidderRef',
              select: {
                _asBidderReviewsRef: 1,
                _asProposerReviewsRef: 1,
                userId: 1,
                displayName: 1,
                profileImage: 1,
                personalParagraph: 1,
                membershipStatus: 1,
                agreedToServiceTerms: 1,
                createdAt: 1,
                email: 1,
                rating: 1,
                notifications: 1,
              },
            },
          })
          .lean(true)
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
            _id: 1,
            _ownerRef: 1,
            title: 1,
            state: 1,
            jobCompletion: 1,
            detailedDescription: 1,
            stats: 1,
            location: 1,
            startingDateAndTime: 1,
            durationOfJob: 1,
            fromTemplateId: 1,
            reported: 1,
            extras: 1,
            createdAt: 1,
          }
        )
          .populate({ path: '_ownerRef', select: jobOwnerFields })
          .lean(true)
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
                  agreedToServiceTerms: 1,
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
  addAJob: async (jobDetails, mongoDbUserId) => {
    try {
      const newJob = await new JobModel({
        ...jobDetails,
        _ownerRef: mongoDbUserId,
      }).save();

      await User.findOneAndUpdate(
        { _id: mongoDbUserId },
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
  updateViewedBy: (jobId, mongoDbUserId) => {
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $addToSet: {
          viewedBy: mongoDbUserId,
        },
      }
    )
      .lean(true)
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
      .lean(true)
      .exec();
  },
  updateBooedBy: (jobId, mongoDbUserId) => {
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $addToSet: {
          booedBy: mongoDbUserId,
        },
      }
    )
      .lean(true)
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
        .lean(true)
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
                _postedJobsRef: 0,
                _postedBidsRef: 0,
                _asBidderReviewsRef: 0,
                _asProposerReviewsRef: 0,
                verification: 0,
                settings: 0,
                extras: 0,
                stripeConnect: 0,
              },
            },
          })
          .populate({
            path: '_ownerRef',
            select: {
              _postedJobsRef: 0,
              _postedBidsRef: 0,
              _asBidderReviewsRef: 0,
              _asProposerReviewsRef: 0,
              verification: 0,
              settings: 0,
              extras: 0,
              stripeConnect: 0,
            },
          })
          .lean(true)
          .exec();

        resolve(jobWithBidderDetails);
      } catch (e) {
        reject(e);
      }
    });
  },
  getAllJobsToBidOn: () => {
    // wil return all jobs in the system
    return new Promise((resolve, reject) => {
      const jobFields = {
        _ownerRef: 1,
        _bidsListRef: 1,
        title: 1,
        state: 1,
        detailedDescription: 1,
        stats: 1,
        startingDateAndTime: 1,
        durationOfJob: 1,
        fromTemplateId: 1,
        reported: 1,
        createdAt: 1,
        updatedAt: 1,
        location: 1,
        viewedBy: 1,
        booedBy: 1,
      };
      const jobOwnerFields = {
        displayName: 1,
        profileImage: 1,
        _id: 1,
        rating: 1,
        notifications: 1,
      };

      JobModel.find({ state: { $eq: 'OPEN' } }, jobFields, {
        sort: { startingDateAndTime: 1 },
        allowDiskUse: true,
      })
        // .where('startingDateAndTime')
        // .gt(new Date())
        .populate({
          path: '_ownerRef',
          select: jobOwnerFields,
        })
        .populate({
          path: '_bidsListRef',
          select: { _bidderRef: 1, bidAmount: 1 },
        })
        .lean(true)
        .exec((error, results) => {
          try {
            if (error) {
              return reject(error);
            }
            return resolve(results);
          } catch (e) {
            return reject(e);
          }
        });
    });
  },
  // get jobs near a given location
  // default search raduis is 15km raduis
  // default include all
  getJobsNear: ({ searchLocation, searchRaduisInMeters = 15000, jobTypeFilter = [] }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let aggregateSearchQuery = {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [searchLocation.lng, searchLocation.lat],
            },
            distanceField: 'dist.calculated',
            includeLocs: 'dist.location',
            // limit: 50,
            distanceMultiplier: 1 / 1000, //meters
            maxDistance: searchRaduisInMeters, //meters
            spherical: true,
            uniqueDocs: true,
          },
        };
        if (jobTypeFilter && jobTypeFilter.length > 0) {
          //filter categories of jobs
          aggregateSearchQuery.$geoNear.query = {
            fromTemplateId: { $in: jobTypeFilter },
          };
        }

        JobModel.aggregate(
          [
            aggregateSearchQuery,
            {
              $project: {
                _id: 1,
              },
            },
          ],
          async (error, results) => {
            //populate job fields
            if (error) {
              reject(error);
            } else if (results && results.length > 0) {
              try {
                let searchResults = results.map(async (job) => {
                  const dbJob = await JobModel.findById(job._id, {
                    _bidsListRef: 0,
                    _awardedBidRef: 0,
                    _reviewRef: 0,
                    addressText: 0,
                    extras: 0,
                  })
                    .populate({
                      path: '_ownerRef',
                      select: {
                        displayName: 1,
                        profileImage: 1,
                        membershipStatus: 1,
                        rating: 1,
                        createdAt: 1,
                      },
                    })
                    .lean(true)
                    .exec();

                  return dbJob;
                });

                const finalList = await Promise.all(searchResults);
                resolve(finalList);
              } catch (e) {
                reject(e);
              }
            } else {
              // no jobs found return empty set
              return resolve([]);
            }
          }
        );
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
        .lean(true)
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
        .lean(true)
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
            agreedToServiceTerms: 0,
            extras: 0,
            settings: 0,
            creditCards: 0,
            updatedAt: 0,
            __v: 0,
            verificationIdImage: 0,
          },
        },
      })

      .lean(true)
      .exec();
  },
  findOneByJobId: (id) => {
    return JobModel.findOne({ _id: id })
      .lean(true)
      .exec();
  },
  isJobOwner: (mongoDbUserId, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _ownerRef: 1 })
      .where('_ownerRef')
      .equals(mongoDbUserId)
      .lean(true)
      .exec();
  },
  isAwardedBidder: (mongoDbUserId, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _awardedBidRef: 1 })
      .populate({
        path: '_awardedBidRef',
        select: {
          _bidderRef: 1,
        },
        populate: {
          path: '_bidderRef',
          match: { _id: { $eq: mongoDbUserId } },
          select: { _id: 1 },
        },
      })
      .lean(true)
      .exec();
  },
  findOneByJobIdAndUpdateJobInfo: (jobId, newJobDetails, options) => {
    // xxx to do , validate user input and use some sanitizer tool to prevent coded content
    return JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        $set: { ...newJobDetails },
      },
      options
    )
      .lean(true)
      .exec();
  },
  deleteJob: async (jobId, mongoDbUserId) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        const job = await JobModel.findOne({ _id: jobId, _ownerRef: mongoDbUserId })
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
          .lean(true)
          .exec();

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },
};
