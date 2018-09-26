//handle all user data manipulations
const mongoose = require('mongoose');

const utils = require('../utils/utilities');
const {
  AppHealthSchemaId,
  AppJobsSchemaId,
  AppUsersSchemaId
} = require('../models/zModalConstants');

const AppHealthModel = mongoose.model('AppHealthModel');
const AppJobsModel = mongoose.model('AppJobsModel');
const AppUsersModel = mongoose.model('AppUsersModel');

exports.AppHealthModel = {
  initialize: () => {
    const query = { appHealthSchemaId: AppHealthSchemaId };
    const update = {};
    const options = {
      // Return the document after updates are applied
      new: true,
      // Create a document if one isn't found. Required
      // for `setDefaultsOnInsert`
      upsert: true,
      setDefaultsOnInsert: true
    };
    return AppHealthModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  },
  incrementField: fieldToUpdate => {
    let update;
    switch (fieldToUpdate) {
      case 'totalUsers':
        update = { $inc: { totalUsers: 1 } };
        break;
      case 'totalJobs':
        update = { $inc: { totalJobs: 1 } };
        break;
      case 'totalFulfilledJobs':
        update = { $inc: { totalFulfilledJobs: 1 } };
        break;
    }
    if (update) {
      const query = { appHealthSchemaId: AppHealthSchemaId };
      const options = {
        // Return the document after updates are applied
        new: true
      };
      return AppHealthModel.findOneAndUpdate(query, update, options)
        .lean(true)
        .exec();
    }
    return null;
  },
  setWhatsNew: msg => {
    const update = { $set: { whatsNew: msg } };

    const query = { appHealthSchemaId: AppHealthSchemaId };
    const options = {
      // Return the document after updates are applied
      new: true
    };
    return AppHealthModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  },
  siteState: ({
    situation,
    situationDetails,
    expectedDownDate,
    expectedGoBackOnline
  }) => {
    const update = {
      $set: {
        situation: situation,
        situationDetails: situationDetails,
        expectedDownDate: expectedDownDate,
        expectedGoBackOnline: expectedGoBackOnline
      }
    };
    const query = { appHealthSchemaId: AppHealthSchemaId };
    const options = {
      // Return the document after updates are applied
      new: true
    };
    return AppHealthModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  }
};

exports.AppJobsModel = {
  initialize: () => {
    const query = { appJobsSchemaId: AppJobsSchemaId };
    const update = {};
    const options = {
      // Return the document after updates are applied
      new: true,
      // Create a document if one isn't found. Required
      // for `setDefaultsOnInsert`
      upsert: true,
      setDefaultsOnInsert: true
    };
    return AppJobsModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  },
  addToJobsIdList: newJobId => {
    const query = { appJobsSchemaId: AppJobsSchemaId };
    const options = {
      // Return the document after updates are applied
      new: true
    };
    const update = { $push: { jobsIdList: newJobId } };

    return AppJobsModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  }
};

exports.AppUsersModel = {
  initialize: async () => {
    const query = { appUsersSchemaId: AppUsersSchemaId };
    const update = {};
    const options = {
      // Return the document after updates are applied
      new: true,
      // Create a document if one isn't found. Required
      // for `setDefaultsOnInsert`
      upsert: true,
      setDefaultsOnInsert: true
    };
    return AppUsersModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  },
  addToUsersList: newUserMongoDbId => {
    const query = { appUsersSchemaId: AppUsersSchemaId };
    const options = {
      // Return the document after updates are applied
      new: true
    };
    const update = { $push: { usersIdList: newUserMongoDbId } };

    return AppUsersModel.findOneAndUpdate(query, update, options)
      .lean(true)
      .exec();
  },
  getUsersFromUsersList: async () => {
    try {
      const populateOptions = {
        path: 'usersIdList',
        select: 'globalRating displayName phoneNumber profileImage'
      };

      const populatedUsers = await AppUsersModel.findOne(
        { appUsersSchemaId: AppUsersSchemaId },
        { usersIdList: 1 }
      )
        .populate(populateOptions)
        .lean(true)
        .exec(); // only works if we pushed refs to children
      return populatedUsers;
    } catch (e) {
      return e;
    }
  }
};
