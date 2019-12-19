const { jobDataAccess } = require('../data-access/jobDataAccess');
const { reviewDataAccess } = require('../data-access/reviewDataAccess');
const userDataAccess = require('../data-access/userDataAccess');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');

const requireJobOwner = require('../middleware/requireJobOwner');
const requireCurrentUserIsTheAwardedTasker = require('../middleware/requireCurrentUserIsTheAwardedTasker');

const requireProposerReviewPreChecksPass = require('../middleware/requireProposerReviewPreChecksPass');
const requireTaskerReviewPreChecksPass = require('../middleware/requireTaskerReviewPreChecksPass');

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

        const job = await jobDataAccess.getFullJobDetails(jobId);
        const reviewId = job._reviewRef._id.toString();

        const { proposerId, awardedTasker } = res.locals.bidOrBoo;
        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          proposerReview: {
            ratingCategories: [
              {
                category: 'QUALITY_OF_WORK',
                rating: qualityOfWorkRating,
              },
              {
                category: 'PUNCTUALITY',
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
        if (
          updatedReviewModel.proposerReview &&
          updatedReviewModel.proposerReview.personalComment &&
          updatedReviewModel.taskerReview &&
          updatedReviewModel.taskerReview.personalComment
        ) {
          await jobDataAccess.updateState(jobId, 'ARCHIVE');
        }
        const taskerRatingDetails = job._awardedBidRef._taskerRef.rating;

        const thisTaskAvgRating =
          (qualityOfWorkRating + punctualityRating + communicationRating + mannerRating) / 4;

        const totalNumberOfTimesBeenRated = taskerRatingDetails.numberOfTimesBeenRated + 1;
        const newTotalOfAllRatings = taskerRatingDetails.totalOfAllRatings + thisTaskAvgRating;
        let newTaskerGlobalRating = newTotalOfAllRatings / totalNumberOfTimesBeenRated;
        if (newTaskerGlobalRating) {
          newTaskerGlobalRating = parseFloat(newTaskerGlobalRating.toFixed(1));
        }

        await userDataAccess.proposerPushesAReview(
          reviewId,
          proposerId,
          job._id,
          awardedTasker._id,
          newTaskerGlobalRating,
          newTotalOfAllRatings,
          personalComment
        );

        // XXX email both to tell them rating is avilable

        return res.send({ success: true, message: 'Proposer Review submitted successfully' });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To submit review', details: `${e}` });
      }
    }
  );

  app.put(
    ROUTES.API.REVIEW.PUT.taskerSubmitReview,
    requireLogin,
    requireCurrentUserIsTheAwardedTasker,
    requireTaskerReviewPreChecksPass,
    async (req, res) => {
      try {
        const {
          jobId,
          accuracyOfPostRating,
          punctualityRating,
          communicationRating,
          mannerRating,
          personalComment,
        } = req.body.data;

        const job = await jobDataAccess.getFullJobDetails(jobId);
        const reviewId = job._reviewRef._id.toString();

        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          taskerReview: {
            ratingCategories: [
              {
                category: 'ACCURACY_OF_POST',
                rating: accuracyOfPostRating,
              },
              {
                category: 'PUNCTUALITY',
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
        if (
          updatedReviewModel.proposerReview &&
          updatedReviewModel.proposerReview.personalComment &&
          updatedReviewModel.taskerReview &&
          updatedReviewModel.taskerReview.personalComment
        ) {
          await jobDataAccess.updateState(jobId, 'ARCHIVE');
        }
        const ownerRatingDetails = job._ownerRef.rating;

        const thisTaskAvgRating =
          (accuracyOfPostRating + punctualityRating + communicationRating + mannerRating) / 4;

        const totalNumberOfTimesBeenRated = ownerRatingDetails.numberOfTimesBeenRated + 1;
        const newTotalOfAllRatings = ownerRatingDetails.totalOfAllRatings + thisTaskAvgRating;
        let newProposerGlobalRating = newTotalOfAllRatings / totalNumberOfTimesBeenRated;
        if (newProposerGlobalRating) {
          newProposerGlobalRating = parseFloat(newProposerGlobalRating.toFixed(1));
        }

        await userDataAccess.taskerPushesAReview(
          reviewId,
          job._awardedBidRef._taskerRef._id,
          job._awardedBidRef._id,
          job._ownerRef._id,
          newProposerGlobalRating,
          newTotalOfAllRatings,
          personalComment
        );

        return res.send({ success: true, message: "Tasker's Review submitted successfully" });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To taskerSubmitReview', details: `${e}` });
      }
    }
  );
};
