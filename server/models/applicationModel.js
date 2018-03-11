const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

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
  userIdList: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }], // job Ids for all available jobs
  bidIdList: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }], // job Ids for all available jobs
  templateIdList: [Number], //template Ids for all our templates
  announcements: [String], // general whats new in our site
  siteState: String //will use if we need to inform user about /maintainance/deployments ,,etc
});

mongoose.model('AppModel', AppSchema);
