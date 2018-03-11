const mongoose = require('mongoose');
const { Schema } = mongoose;
// a singleton of app
// all dates should be stored in UTC format
// var utcMoment = moment.utc();
// var utcDate = new Date( utcMoment.format() );

// all _props are properties referenced from other schemas

const AppSchema = new Schema({
  totalUsers: Number,
  totalJobs: Number,
  totalFulfilledJobs: Number, //number of completed jobs via our site
  totalBids: Number,
  jobsIdList: [{ type: Schema.Types.ObjectId, ref: 'JobModel' }], // job Ids for all available jobs
  usersIdList: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }], // job Ids for all available jobs
  bidsIdList: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }], // job Ids for all available jobs
  templatesIdList: [Number], //template Ids for all our templates
  whatsNew: [String], // general whats new in our site
  siteState: {
    type: String,
    enum: ['ACTIVE', 'MAINTAINANCE', 'UNDER_DEVELOPMENT'],
    situationDetails: String,
    expectedDownDate: Date,
    expectedGoBackOnline: Date,
  }, //will use if we need to inform user about /maintainance/deployments ,,etc
  extras: Object
});

mongoose.model('AppModel', AppSchema);
