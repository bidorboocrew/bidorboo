const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const BidSchema = new Schema({
  _bidderId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
  _job: { type: Schema.Types.ObjectId, ref: 'JobModel', required: true }, //we will use this to reference the jobs
  bidId: { type: String, required: true },
  dateCreated: Date,
  lastUpdated: Date,
  state: {
    type: String,
    enum: ['OPEN', 'BOO', 'WIN', 'CANCEL', 'MODIFIED']
  },
  bidAmount: String //dolar amount
});

mongoose.model('BidModel', BidSchema);
