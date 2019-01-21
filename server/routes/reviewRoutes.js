const { jobDataAccess } = require('../data-access/jobDataAccess');
const { reviewDataAccess } = require('../data-access/reviewDataAccess');
const userDataAccess = require('../data-access/userDataAccess');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');

const requireJobOwner = require('../middleware/requireJobOwner');
const requireAwardedBidder = require('../middleware/requireAwardedBidder');

const requireProposerReviewPreChecksPass = require('../middleware/requireBidderReviewPreChecksPass');
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
          proposerId,
          jobId,
          bidderId,
          qualityOfWorkRating,
          punctualityRating,
          communicationRating,
          mannerRating,
          personalComment,
        } = req.body.data;

        const job = await jobDataAccess.getJobWithBidDetails(jobId);
        const reviewId = job._reviewRef._id.toString();

        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          proposerSubmitted: true,
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

        const ownerRatingDetails = job._ownerRef.rating;
        const newProposerFulfilledJobsCount = ownerRatingDetails.fulfilledJobs + 1;

        const bidderRatingDetails = job._awardedBidRef._bidderRef.rating;

        const thisTaskAvgRating =
          (qualityOfWorkRating + punctualityRating + communicationRating + mannerRating) / 4;
        const newBidderGlobalRating =
          (bidderRatingDetails.globalRating + thisTaskAvgRating) /
          bidderRatingDetails.fulfilledBids;

        const updateCorrespondingUsers = await userDataAccess.proposerPushesAReview(
          reviewId,
          proposeId,
          newProposerFulfilledJobsCount,
          bidderId,
          newBidderGlobalRating
        );

        return res.send({ success: true, message: 'Proposer Review submitted successfully' });
      } catch (e) {
        return res
          .status(500)
          .send({ errorMsg: 'Failed To bidderConfirmsJobCompleted', details: `${e}` });
      }
    }
  );

  app.put(
    ROUTES.API.REVIEW.PUT.bidderSubmitReview,
    requireLogin,
    requireAwardedBidder,
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

        const job = await jobDataAccess.getJobWithBidDetails(jobId);
        const reviewId = job._reviewRef._id.toString();

        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          proposerSubmitted: true,
          proposerReview: {
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

        const bidderRatingDetails = job._awardedBidRef._bidderRef.rating;
        const newBidderFulfilledBidsCount = bidderRatingDetails.fulfilledBids + 1;

        const ownerRatingDetails = job._ownerRef.rating;

        const thisTaskAvgRating =
          (accuracyOfPostRating + punctualityRating + communicationRating + mannerRating) / 4;
        const newProposerGlobalRating =
          (ownerRatingDetails.globalRating + thisTaskAvgRating) / ownerRatingDetails.fulfilledBids;

        const updateCorrespondingUsers = await userDataAccess.bidderPushesAReview(
          reviewRef,
          bidderId,
          newBidderFulfilledBidsCount,
          proposeId,
          newProposerGlobalRating
        );

        return res.send({ success: true, message: 'Bidder Review submitted successfully' });
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To bidderSubmitReview', details: `${e}` });
      }
    }
  );
};
