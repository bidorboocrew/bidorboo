const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId && req.user._id) {
      const requesterId = req.user._id;

      const {
        requestId,
        qualityOfWorkRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !requesterId ||
        !requestId ||
        !qualityOfWorkRating ||
        !punctualityRating ||
        !communicationRating ||
        !mannerRating ||
        !personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'missing parameters . can not pass requireRequesterReviewPreChecksPass.',
        });
      }

      const requestDetails = await requestDataAccess.getFullRequestDetails(requestId);

      const awardedTasker =
        requestDetails._awardedBidRef && requestDetails._awardedBidRef._taskerRef._id;
      if (!awardedTasker) {
        return res.status(403).send({
          errorMsg: 'Only the Tasker who fulfilled the request can perform this action',
        });
      }
      if (!requestDetails._reviewRef) {
        await requestDataAccess.kickStartReviewModel({
          requestId,
          taskerId: awardedTasker,
          requesterId,
        });
      }

      if (
        requestDetails._reviewRef &&
        requestDetails._reviewRef.requesterReview &&
        requestDetails._reviewRef.requesterReview.personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'You have already submit a review.',
        });
      }

      res.locals.bidOrBoo = res.locals.bidOrBoo || {};
      res.locals.bidOrBoo = {
        requestId,
        qualityOfWorkRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
        awardedTasker,
        requesterId,
      };
      next();
    } else {
      return res.status(403).send({ errorMsg: 'You must be logged in to perform this action.' });
    }
  } catch (e) {
    return res.status(400).send({
      safeMsg:
        'some error occurred, please chat with our customer support using the chat button at the bottom of the page',
      errorMsg: 'failed to pass require requesterReview checks',
      details: `${e}`,
    });
  }
};
