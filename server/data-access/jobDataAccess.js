//handle all user data manipulations
const mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');

const utils = require('../utils/utilities');

const User = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const applicationDataAccess = require('../data-access/applicationDataAccess');

const { AppHealthSchemaId } = require('../models/zModalConstants');

exports.jobDataAccess = {
  getAllJobsForUser: userId => {
    const populateOptions = {
      path: '_postedJobs',
      select: 'detailedDescription location -_id'
    };
    return User.findOne({ userId: userId }, { _postedJobs: 1, _id: 0 })
      .populate(populateOptions)
      .lean()
      .exec(); // only works if we pushed refs to children
  },
  getJobsNear: specifiedLocation => {
    // #1
    return JobModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: specifiedLocation },
          distanceField: 'dist.calculated',
          includeLocs: 'dist.location',
          limit: 20,
          distanceMultiplier: 1 / 1000,
          maxDistance: 5, //meters
          spherical: true,
          uniqueDocs: true
        }
      },
      {
        $project: {
          detailedDescription: 0,
          __v: 0,
          _ownerId: 0,
          createdAt: 0,
          updatedAt: 0,
          whoSeenThis: 0,
          properties: 0,
          extras: 0,
          _bidsList: 0,
          _id: 0,
          state: 0
        }
      }
    ]).exec();

    // #2
    // return JobModel.find({
    //   location: {
    //     $near: {
    //       $geometry: { type: 'Point', coordinates: specifiedLocation },
    //       $maxDistance: 1000000,

    //     }
    //   }
    // }).limit(1).exec();
  },
  addAJob: async jobDetails => {
    try {
      const newJob = await new JobModel({
        ...jobDetails,
        state: 'OPEN',
        isNew: true
      }).save();
      // await Promise.all([
      //   applicationDataAccess.AppHealthModel.incrementField('totalUsers'),
      //   applicationDataAccess.AppUsersModel.addToUsersList(newUser.id)
      // ]);

      return newJob;
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
      .lean()
      .exec();
  },

  isJobOwner: (currentSessionUserId, jobId) => {
    return JobModel.findOne({ _id: jobId }, { _ownerId: 1 })
      .where('_ownerId')
      .equals(currentSessionUserId)
      .lean()
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
      .lean()
      .exec();
  }
};
