//handle all user data manipulations
const mongoose = require('mongoose');

const Review = mongoose.model('ReviewModel');

exports.reviewDataAccess = {
  updateReviewModel: async (reviewId, updateData) => {
    return await Review.findOneAndUpdate(
      { _id: reviewId },
      {
        $set: { ...updateData },
      }
    )
      .lean({ virtuals: true })
      .exec();
  },
};
