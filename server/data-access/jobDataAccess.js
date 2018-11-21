//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');

const schemaHelpers = require('./util_schemaPopulateProjectHelpers');

exports.jobDataAccess = {
  // get jobs for a user and filter by a given state
  getUserJobsByState: async (userId, stateFilter) => {
    return new Promise(async (resolve, reject) => {
      try {
        const jobs = await User.findOne({ userId: userId }, { _postedJobsRef: 1 })
          .populate({
            path: '_postedJobsRef',
            select: schemaHelpers.JobFull,
            options: { sort: { createdAt: -1 } },
          })
          .lean(true)
          .exec();

        if (jobs && jobs._postedJobsRef && stateFilter) {
          const filteredJobs = jobs._postedJobsRef.filter((job) => {
            return job.state === stateFilter;
          });

          resolve(filteredJobs);
        }
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
            _postedJobsRef: { $each: [newJob._id], $sort: { createdAt: -1 } },
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
  addJobImages: async (jobId, images) => {
    try {
      // let jobImagesArray = [];
      // if (jobImages && jobImages.length > 0) {
      //   jobImagesArray = jobImage.map((imgDetail) => {
      //     return {
      //       url: imgDetail.url,
      //       public_id: imgDetail.public_id,
      //     };
      //   });
      // }

      const updatedJob = await JobModel.findOneAndUpdate(
        { _id: jobId },
        {
          $push: {
            jobImages: { $each: images },
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
                addressText: 0,
                userRole: 0,
                settings: 0,
                extras: 0,
                verificationIdImage: 0,
                canBid: 0,
                canPost: 0,
                updatedAt: 0,
              },
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
  getAllJobsToBidOnForLoggedOutUser: () => {
    // wil return all jobs in the system
    return new Promise((resolve, reject) => {
      const jobFields = {
        _ownerRef: 1,
        title: 1,
        state: 1,
        detailedDescription: 1,
        stats: 1,
        startingDateAndTime: 1,
        durationOfJob: 1,
        fromTemplateId: 1,
        reportThisJob: 1,
        createdAt: 1,
        updatedAt: 1,
        location: 1,
      };
      const jobOwnerFields = { displayName: 1, profileImage: 1, _id: 1 };

      JobModel.find({}, jobFields, {
        sort: { createdAt: -1 },
      })
        .populate({
          path: '_ownerRef',
          select: jobOwnerFields,
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
  getAllJobsToBidOnForLoggedInUser: (userId, mongoDbUserId) => {
    // will return jobs that you did not bid on and that you are not owner of
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
        reportThisJob: 1,
        createdAt: 1,
        updatedAt: 1,
        location: 1,
      };
      const jobOwnerFields = { displayName: 1, profileImage: 1, _id: 1 };

      JobModel.find({ _ownerRef: { $not: { $eq: mongoDbUserId } } }, jobFields, {
        sort: { createdAt: -1 },
      })
        .populate({
          path: '_ownerRef',
          select: jobOwnerFields,
        })
        .populate({
          path: '_bidsListRef',
          select: { _bidderRef: 1 },
        })
        .lean(true)
        .exec((error, results) => {
          try {
            if (error) {
              return reject(error);
            } else {
              // this will be hit if user is logged in

              // remove jobs that user already bid on
              let openJobsUserHasntBidOn =
                results &&
                results.filter((job) => {
                  const isOpenState = job.state === 'OPEN';
                  let didCurrentUserAlreadyBidOnThisJob = false;
                  if (isOpenState && job._bidsListRef && job._bidsListRef.length > 0) {
                    didCurrentUserAlreadyBidOnThisJob = job._bidsListRef.some((bid) => {
                      return (
                        bid._bidderRef && bid._bidderRef.toString() === mongoDbUserId.toString()
                      );
                    });
                  }
                  // return jobs where the state is open and the current user did NOT bid on them yet
                  return isOpenState && !didCurrentUserAlreadyBidOnThisJob;
                });
              return resolve(openJobsUserHasntBidOn);
            }
          } catch (e) {
            return reject(e);
          }
        });
    });
  },
  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------

  // get jobs near a given location
  // default search raduis is 15km raduis
  // default include all
  getJobsNear: ({ searchLocation, searchRaduisInMeters = 15000, jobTypeFilter = [] }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (jobTypeFilter && jobTypeFilter.length > 0) {
          //filter categories of jobs
          geoNearQuery.$geoNear.query = {
            fromTemplateId: { $in: jobTypeFilter },
          };
        }

        JobModel.aggregate(
          [
            {
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
            },
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
                      select: { displayName: 1, profileImage: 1 },
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
  awardedBidder: async (jobId, bidId) => {
    const updateRelevantItems = await Promise.all([
      BidModel.findOneAndUpdate(
        { _id: bidId },
        {
          $set: { state: 'AWARDED' },
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
            hasAgreedToServiceTerms: 0,
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
  isJobOwner: (currentSessionUserId, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _ownerRef: 1 })
      .where('_ownerRef')
      .equals(currentSessionUserId)
      .lean(true)
      .exec();
  },
  findOneByJobIdAndUpdateJobInfo: (jobIdToUpdate, newJobDetails, options) => {
    // xxx to do , validate user input and use some sanitizer tool to prevent coded content
    return JobModel.findOneAndUpdate(
      { _id: jobIdToUpdate },
      {
        $set: { ...newJobDetails },
      },
      options
    )
      .lean(true)
      .exec();
  },
  deleteJob: async (jobId, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        //find the job
        const job = await JobModel.findById({ _id: jobId })
          .lean(true)
          .exec();

        // delete all bids associatedc
        const areThereAnyBids = job._bidsListRef && job._bidsListRef.length > 0;
        if (areThereAnyBids) {
          const referencedBidIds = job._bidsListRef.map((bidRef) => {
            return bidRef.toString();
          });

          job.bidderIds.forEach(async (bidderId) => {
            // clean ref for bidders
            await User.findOneAndUpdate(
              { userId: bidderId },
              { $pull: { _postedBidsRef: { $in: referencedBidIds } } },
              { new: true }
            )
              .lean(true)
              .exec();
          });

          referencedBidIds.forEach(async (bidId) => {
            await BidModel.deleteOne({ _id: bidId });
          });
        }
        // delete job model
        await JobModel.deleteOne({ _id: jobId })
          .lean(true)
          .exec();
        // clean for owner
        await User.findOneAndUpdate(
          { userId: userId },
          { $pull: { _postedJobsRef: { $in: [jobId] } } },
          { new: true }
        )
          .lean(true)
          .exec();

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },
};
