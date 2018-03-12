const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
  AppHealthSchemaId,
  AppJobsSchemaId,
  AppUsersSchemaId
} = require('./zModalConstants');
// a singleton of app
// all dates should be stored in UTC format
// var utcMoment = moment.utc();
// var utcDate = new Date( utcMoment.format() );

// all _props are properties referenced from other schemas

const AppHealth = new Schema({
  appHealthSchemaId: { type: String, deafult: AppHealthSchemaId },
  totalUsers: Number,
  totalJobs: Number,
  totalFulfilledJobs: Number, //number of completed jobs via our site
  totalBids: Number,
  whatsNew: { type: [String], default: null }, // general whats new in our site
  siteState: {
    type: String,
    enum: ['ACTIVE', 'MAINTAINANCE', 'UNDER_DEVELOPMENT'],
    situationDetails: String,
    expectedDownDate: Date,
    expectedGoBackOnline: Date
  }, //will use if we need to inform user about /maintainance/deployments ,,etc
  extras: { type: Object, default: null }
});

const AppJobs = new Schema({
  appJobsSchemaId: { type: String, deafult: AppJobsSchemaId },
  jobsIdList: [{ type: Schema.Types.ObjectId, ref: 'JobModel' }], // job Ids for all available jobs
  extras: { type: Object, default: null }
});

const AppUsers = new Schema({
  appUsersSchemaId: { type: String, deafult: AppUsersSchemaId },
  usersIdList: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }], // job Ids for all available jobs
  extras: { type: Object, default: null }
});

mongoose.model('AppHealthModel', AppHealth);
mongoose.model('AppJobsModel', AppJobs);
mongoose.model('AppUsersModel', AppUsers);
