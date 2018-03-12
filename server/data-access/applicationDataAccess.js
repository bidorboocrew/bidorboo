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
  initialize: async () => {
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
    return AppHealthModel.findOneAndUpdate(
      query,
      update,
      options,
      (error, doc) => {}
    );
  }
};

exports.AppJobsModel = {
  initialize: async () => {
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
    return AppJobsModel.findOneAndUpdate(
      query,
      update,
      options,
      (error, doc) => {}
    );
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
    return AppUsersModel.findOneAndUpdate(
      query,
      update,
      options,
      (error, doc) => {}
    );
  }
};
