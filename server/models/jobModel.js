const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const PropertySchema = new Schema({
  fieldType: String, // in the future make it enum [ 'address field' , fone number ... date ..etc]
  fieldValue: Object
});

const StatsSchema = new Schema({
  minbid: Number, // in the future make it enum [ 'address field' , fone number ... date ..etc]
  avg: Number,
  max: Number,
  recommended: String //reference to the ideal bid which is =  $bid amount /bidder's rating
});

// _props are reference properties
const JobSchema = new Schema({
  _ownerId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  _bidRefernce: [{ tpe: Schema.Types.ObjectId, ref: 'BidModel' }],
  jobId: { type: String, required: true }, //we will use this to reference the jobs
  title: String,
  dateCreated: Date,
  lastUpdated: Date,
  state: {
    type: String,
    enum: ['OPEN', 'AWARDED', 'DONE', 'CANCELED', 'REOPENED']
  },
  properties: [PropertySchema], //list of props needed for a the template
  stats: StatsSchema
});

mongoose.model('JobModel', JobSchema);
