//handle all user data manipulations
const mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');

const utils = require('../utils/utilities');

const JobModel = mongoose.model('JobModel');
const applicationDataAccess = require('../data-access/applicationDataAccess');

const { AppHealthSchemaId } = require('../models/zModalConstants');

exports.jobDataAccess = {
  addAJob: async jobDetails => {
    try {
      const newJob = await new JobModel({
        ...jobDetails,
        state: 'OPEN'
      }).save();
      await Promise.all([
        applicationDataAccess.AppHealthModel.incrementField('totalJobs'),
        applicationDataAccess.AppJobsModel.addToJobsIdList(newJob.id)
      ]);

      return newJob;
    } catch (e) {
      throw e;
    }
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
