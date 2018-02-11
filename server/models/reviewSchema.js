const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const RatingSchema = new Schema({
  categoryOfRating: {
    type: String,
    enum: [
      'ACCURACY_OF_POST',
      'PROFICIENCY',
      'ON_TIME',
      'MANNERS',
      'CLEANLINESS'
    ]
  },
  rating: Number
});
const ReviewSchema = new Schema({
  _bidderId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  _proposerId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  reviewId: String,
  dateInitiated: Date,
  proposerReview: {
    rating: [RatingSchema],
    comment: String, //max 120 chars
    completed: { type: Boolean, default: false }
  },
  bidderReview: {
    rating: Number,
    comment: [RatingSchema], //max 120 chars
    completed: { type: Boolean, default: false }
  },
  shouldRevealResultsToBoth: { type: Boolean, default: false } //this wil turn true only when both completed the review
});

mongoose.model('ReviewModel', ReviewSchema);
