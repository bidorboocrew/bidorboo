//handle all user data manipulations
const mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');

const utils = require('../utils/utilities');

const User = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const applicationDataAccess = require('../data-access/applicationDataAccess');

const { AppHealthSchemaId } = require('../models/zModalConstants');

exports.jobDataAccess = {
  /**
   * called when we hit the my jobs route
   * get all jobs for a user Id
   * populate the _postedJobs with the full ref data
   * populate the _bidsList with full  ref data
   */
  getAllJobsForUser: userId => {
    const populatePostedJobsOptions = {
      path: '_postedJobs',
      options: {
        // limit: 4, ///xxxx saidm you gotta do something to get the next jobs .. but maybe initially remove the limit ?
        sort: { createdAt: -1 }
      },
      populate: {
        path: '_bidsList',
        populate: {
          path: '_bidderId',
          select: { _id: 1, _reviews: 1, displayName: 1, globalRating: 1 }
        }
      }
    };

    return User.findOne({ userId: userId }, { _postedJobs: 1, _id: 0 })
      .populate(populatePostedJobsOptions)
      .lean(true)
      .exec();
  },

  getAllPostedJobs: () => {
    return JobModel.find(
      {},
      {
        addressText: 0,
        updatedAt: 0,
        _bidsList: 0,
        awardedBidder: 0,
        jobReview: 0,
        extras: 0,
        properties: 0,
        __v: 0,
        whoSeenThis: 0
      },
      { limit: 50, sort: { createdAt: -1 } }
    )
      .populate({
        path: '_ownerId',
        select: { displayName: 1, profileImage: 1, _id: 1 }
      })
      .lean(true)
      .exec(); // only works if we pushed refs to children
  },

  // get jobs near a given location
  // default search raduis is 15km raduis
  // default include all
  getJobsNear: ({
    searchLocation,
    searchRaduisInMeters = 15000,
    jobTypeFilter = []
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const geoNearQuery = {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [searchLocation.lng, searchLocation.lat]
            },
            distanceField: 'dist.calculated',
            includeLocs: 'dist.location',
            limit: 50,
            distanceMultiplier: 1 / 1000, //meters
            maxDistance: searchRaduisInMeters, //meters
            spherical: true,
            uniqueDocs: true
          }
        };
        if (jobTypeFilter && jobTypeFilter.length > 0) {
          //filter categories of jobs
          geoNearQuery.$geoNear.query = {
            fromTemplateId: { $in: jobTypeFilter }
          };
        }

        JobModel.aggregate(
          [
            geoNearQuery,
            {
              $project: {
                __v: 0,
                // _id: 1,
                updatedAt: 0,
                whoSeenThis: 0,
                properties: 0,
                extras: 0,
                _bidsList: 0
              }
            }
          ],
          async (error, results) => {
            //populate job fields
            if(error){
              reject(error);
            }
            else if (results && results.length > 0) {
              try {
                let searchResults = results.map(async job => {
                  const dbJob = await JobModel.findById(job._id, {
                    addressText: 0,
                    updatedAt: 0,
                    _bidsList: 0,
                    awardedBidder: 0,
                    jobReview: 0,
                    extras: 0,
                    properties: 0,
                    __v: 0,
                    whoSeenThis: 0
                  })
                    .populate({
                      path: '_ownerId',
                      select: { displayName: 1, profileImage: 1, _id: 0 }
                    })
                    .lean(true)
                    .exec();

                  return dbJob;
                });

                const finalList = await Promise.all(searchResults);
                resolve(finalList);
              } catch (e) {
                throw reject(e);
              }
            } else {
              // no jobs found return empty set
              return resolve([]);
            }
          }
        ).explain();
      } catch (e) {
        reject(e);
      }
    });
    return;
  },
  addAJob: async (jobDetails, userId) => {
    try {
      const newJob = await new JobModel({
        ...jobDetails,
        state: 'OPEN',
        isNew: true
      }).save();
      const updateUserModelWithNewJob = await User.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            _postedJobs: { $each: [newJob._id], $sort: { createdAt: -1 } }
          }
        },
        { projection: { _id: 1 } }
      )
        .lean(true)
        .exec();

      return updateUserModelWithNewJob._id
        ? newJob
        : { error: 'error while creating job' };
    } catch (e) {
      throw e;
    }

    // await Promise.all([
    //   applicationDataAccess.AppHealthModel.incrementField('totalJobs'),
    //   applicationDataAccess.AppJobsModel.addToJobsIdList(newJob.id)
    // ]);

    // return newJob;
  },
  findOneByJobId: id => {
    return JobModel.findOne(
      { _id: id }
      // {
      //   //exclude
      //   settings: 0,
      //   extras: 0,
      //   userRole: 0,
      //   lockUntil: 0,
      //   loginAttempts: 0,
      //   provider: 0,
      //   paymentRefs: 0,
      //   _reviews: 0,
      //   password: 0,
      //   skills: 0
      // }
    )
      .lean(true)
      .exec();
  },
  isJobOwner: (currentSessionUserId, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _ownerId: 1 })
      .where('_ownerId')
      .equals(currentSessionUserId)
      .lean(true)
      .exec();
  },
  findOneByJobIdAndUpdateJobInfo: (jobIdToUpdate, newJobDetails, options) => {
    return JobModel.findOneAndUpdate(
      { _id: jobIdToUpdate },
      {
        $set: { ...newJobDetails }
      },
      options
    )
      .lean(true)
      .exec();
  }
};
