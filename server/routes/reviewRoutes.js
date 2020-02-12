const { celebrate } = require('celebrate');
const bugsnagClient = require('../index').bugsnagClient;
const { requesterSubmitReview, taskerSubmitReview } = require('../routeSchemas/reviewRoutesSchema');

const { requestDataAccess } = require('../data-access/requestDataAccess');
const { reviewDataAccess } = require('../data-access/reviewDataAccess');
const userDataAccess = require('../data-access/userDataAccess');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');

const requireRequestOwner = require('../middleware/requireRequestOwner');
const requireCurrentUserIsTheAwardedTasker = require('../middleware/requireCurrentUserIsTheAwardedTasker');

const requireRequesterReviewPreChecksPass = require('../middleware/requireRequesterReviewPreChecksPass');
const requireTaskerReviewPreChecksPass = require('../middleware/requireTaskerReviewPreChecksPass');

module.exports = (app) => {
  app.put(
    ROUTES.API.REVIEW.PUT.requesterSubmitReview,
    celebrate(requesterSubmitReview),
    requireLogin,
    requireRequestOwner,
    requireRequesterReviewPreChecksPass,
    async (req, res, next) => {
      try {
        const {
          requestId,
          qualityOfWorkRating,
          punctualityRating,
          communicationRating,
          mannerRating,
          personalComment,
        } = res.locals.bidOrBoo;

        const request = await requestDataAccess.getFullRequestDetails(requestId);
        const reviewId = request._reviewRef._id.toString();

        const { requesterId, awardedTasker } = res.locals.bidOrBoo;
        // update the review model
        const updatedReviewModel = await reviewDataAccess.updateReviewModel(reviewId, {
          requesterReview: {
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
          updatedReviewModel.requesterReview &&
          updatedReviewModel.requesterReview.personalComment &&
          updatedReviewModel.taskerReview &&
          updatedReviewModel.taskerReview.personalComment
        ) {
          await requestDataAccess.updateState(requestId, 'ARCHIVE');
          // XXX email both to tell them rating is avilable
        }
        const taskerRatingDetails = request._awardedBidRef._taskerRef.rating;

        const thisTaskAvgRating =
          (qualityOfWorkRating + punctualityRating + communicationRating + mannerRating) / 4;

        const totalNumberOfTimesBeenRated = taskerRatingDetails.numberOfTimesBeenRated + 1;
        const newTotalOfAllRatings = taskerRatingDetails.totalOfAllRatings + thisTaskAvgRating;
        let newTaskerGlobalRating = newTotalOfAllRatings / totalNumberOfTimesBeenRated;
        if (newTaskerGlobalRating) {
          newTaskerGlobalRating = parseFloat(newTaskerGlobalRating.toFixed(1));
        }

        await userDataAccess.requesterPushesAReview(
          reviewId,
          requesterId,
          request._id,
          awardedTasker._id,
          newTaskerGlobalRating,
          newTotalOfAllRatings,
          personalComment
        );

        return res.send({ success: true, message: 'Requester Review submitted successfully' });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To submit review';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.REVIEW.PUT.taskerSubmitReview,
    celebrate(taskerSubmitReview),
    requireLogin,
    requireCurrentUserIsTheAwardedTasker,
    requireTaskerReviewPreChecksPass,
    async (req, res, next) => {
      try {
        const {
          requestId,
          accuracyOfPostRating,
          punctualityRating,
          communicationRating,
          mannerRating,
          personalComment,
        } = req.body.data;

        const request = await requestDataAccess.getFullRequestDetails(requestId);
        const reviewId = request._reviewRef._id.toString();

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
          updatedReviewModel.requesterReview &&
          updatedReviewModel.requesterReview.personalComment &&
          updatedReviewModel.taskerReview &&
          updatedReviewModel.taskerReview.personalComment
        ) {
          await requestDataAccess.updateState(requestId, 'ARCHIVE');
        }
        const ownerRatingDetails = request._ownerRef.rating;

        const thisTaskAvgRating =
          (accuracyOfPostRating + punctualityRating + communicationRating + mannerRating) / 4;

        const totalNumberOfTimesBeenRated = ownerRatingDetails.numberOfTimesBeenRated + 1;
        const newTotalOfAllRatings = ownerRatingDetails.totalOfAllRatings + thisTaskAvgRating;
        let newRequesterGlobalRating = newTotalOfAllRatings / totalNumberOfTimesBeenRated;
        if (newRequesterGlobalRating) {
          newRequesterGlobalRating = parseFloat(newRequesterGlobalRating.toFixed(1));
        }

        await userDataAccess.taskerPushesAReview(
          reviewId,
          request._awardedBidRef._taskerRef._id,
          request._awardedBidRef._id,
          request._ownerRef._id,
          newRequesterGlobalRating,
          newTotalOfAllRatings,
          personalComment
        );

        return res.send({ success: true, message: "Tasker's Review submitted successfully" });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To submit  review';
        return next(e);
      }
    }
  );
};
