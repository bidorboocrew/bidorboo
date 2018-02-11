const mongoose = require('mongoose');
require('mongoose-type-email');

const { Schema } = mongoose;

const ProviderSchema = new Schema({
  name: String, //google
  Id: String, //googleid
  email: mongoose.SchemaTypes.Email //email
});

//should be flexible in the future to accomodate global address patterns
const AddressSchema = new Schema({
  street: String,
  unit: String,
  city: String,
  province: String,
  state: String,
  postalCode: String,
  country: String,
  extras: String //to handle unique addresses
});

const CreditCardSchema = new Schema({
  number: String,
  type: String
});

const UserSchema = new Schema({
  _postedJobs: [{ type: Schema.Types.ObjectId, ref: 'JobModel' }], //list of all jobs you have posted
  _postedBids: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }], // list of all bids you made
  _reviews: [{ type: Schema.Types.ObjectId, ref: 'ReviewModel' }], //ref to reviews
  userId: { type: String, required: true, unique: true },
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
  displayName: String,
  phoneNumber: { type: String, unique: true },
  password: { type: String, required: true },
  creditCards: [CreditCardSchema], // we will only store the credit cardS number (not expiry nor cvv)
  provider: [ProviderSchema],
  profileImgUrl: { type: String, default: 'https://goo.gl/92gqPL' },
  address: AddressSchema,
  globalRating: Number, // 1-5 stars
  skills: [String], // list of strings representing their skills
  personalParagraph: String, // a blob about who they are
  paymentRefs: [String], // ID to fetch their payments through our system to generate an invoice
  membershipStatus: String, // some challenges like the idea of super host
  extras: Object, // this is a place holder for us to add more analytics
  lastSeenOnline: Date //knowing this dates and time  will help us annotate new tasks and put some badge to show whats new
});

mongoose.model('UserModel', UserSchema);
