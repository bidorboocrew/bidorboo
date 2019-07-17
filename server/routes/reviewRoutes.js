const { jobDataAccess } = require('../data-access/jobDataAccess');
const { reviewDataAccess } = require('../data-access/reviewDataAccess');
const userDataAccess = require('../data-access/userDataAccess');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');

const requireJobOwner = require('../middleware/requireJobOwner');
const requireCurrentUserIsTheAwardedBidder = require('../middleware/requireCurrentUserIsTheAwardedBidder');

const requireProposerReviewPreChecksPass = require('../middleware/requireProposerReviewPreChecksPass');
const requireBidderReviewPreChecksPass = require('../middleware/requireBidderReviewPreChecksPass');

module.exports = (app) => {
  app.put(
    ROUTES.API.REVIEW.PUT.proposerSubmitReview,
    requireLogin,
    requireJobOwner,
    requireProposerReviewPreChecksPass,
    async (req, res) => {
      try {
        const {
          jobId,
          qualityOfWorkRating,
          punctualityRating,
          communicationRating,
          mannerRating,
          personalComment,
        } = res.locals.bidOrBoo;

        const job = await jobDataAccess.getAwardedJobDetails(jobId);
        const reviewId = job._reviewRef._id.toString();

        const { proposerId, awardedBidder } = res.locals.bidOrBoo;
        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          proposerReview: {
            ratingCategories: [
              {
                category: 'QUALITY_OF_WORK',
                rating: qualityOfWorkRating,
              },
              {
                category: 'PUNCTULAITY',
                rating: punctualityRating,
              },
              {
                category: 'COMMUNICATION',
                rating: communicationRating,
              },
              {
                category: 'MANNERS',
                rating: mannerRating,
              },
            ],
            personalComment,
          },
        });

        const bidderRatingDetails = job._awardedBidRef._bidderRef.rating;

        const thisTaskAvgRating =
          (qualityOfWorkRating + punctualityRating + communicationRating + mannerRating) / 4;

        const totalNumberOfTimesBeenRated = bidderRatingDetails.numberOfTimesBeenRated + 1;
        const newTotalOfAllRatings = bidderRatingDetails.totalOfAllRatings + thisTaskAvgRating;
        let newBidderGlobalRating = newTotalOfAllRatings / totalNumberOfTimesBeenRated;
        if (newBidderGlobalRating) {
          newBidderGlobalRating = parseFloat(newBidderGlobalRating.toFixed(1));
        }

        const updateCorrespondingUsers = await userDataAccess.proposerPushesAReview(
          reviewId,
          proposerId,
          job._id,
          awardedBidder._id,
          newBidderGlobalRating,
          newTotalOfAllRatings,
          personalComment
        );

        // xxxx notify stuff
        // if both are done reviewing send the profile review page
        // if one is done the other isnt push notify the other to go and review

        return res.send({ success: true, message: 'Proposer Review submitted successfully' });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To bidderConfirmsJobCompleted', details: `${e}` });
      }
    }
  );

  app.put(
    ROUTES.API.REVIEW.PUT.bidderSubmitReview,
    requireLogin,
    requireCurrentUserIsTheAwardedBidder,
    requireBidderReviewPreChecksPass,
    async (req, res) => {
      try {
        const {
          proposerId,
          jobId,
          bidderId,
          accuracyOfPostRating,
          punctualityRating,
          communicationRating,
          mannerRating,
          personalComment,
        } = req.body.data;

        const job = await jobDataAccess.getAwardedJobDetails(jobId);
        const reviewId = job._reviewRef._id.toString();

        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          bidderReview: {
            ratingCategories: [
              {
                category: 'ACCURACY_OF_POST',
                rating: accuracyOfPostRating,
              },
              {
                category: 'PUNCTULAITY',
                rating: punctualityRating,
              },
              {
                category: 'COMMUNICATION',
                rating: communicationRating,
              },
              {
                category: 'MANNERS',
                rating: mannerRating,
              },
            ],
            personalComment,
          },
        });

        const ownerRatingDetails = job._ownerRef.rating;

        const thisTaskAvgRating =
          (accuracyOfPostRating + punctualityRating + communicationRating + mannerRating) / 4;

        const totalNumberOfTimesBeenRated = ownerRatingDetails.numberOfTimesBeenRated + 1;
        const newTotalOfAllRatings = ownerRatingDetails.totalOfAllRatings + thisTaskAvgRating;
        let newProposerGlobalRating = newTotalOfAllRatings / totalNumberOfTimesBeenRated;
        if (newProposerGlobalRating) {
          newProposerGlobalRating = parseFloat(newProposerGlobalRating.toFixed(1));
        }

        const updateCorrespondingUsers = await userDataAccess.bidderPushesAReview(
          reviewId,
          job._awardedBidRef._bidderRef._id,
          job._awardedBidRef._id,
          job._ownerRef._id,
          newProposerGlobalRating,
          newTotalOfAllRatings,
          personalComment
        );
        // xxxx notify stuff
        // if both are done reviewing send the profile review page
        // if one is done the other isnt push notify the other to go and review

        return res.send({ success: true, message: 'Bidder Review submitted successfully' });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To bidderSubmitReview', details: `${e}` });
      }
    }
  );
};
