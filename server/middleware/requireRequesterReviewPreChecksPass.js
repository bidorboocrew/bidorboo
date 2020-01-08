const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    const requesterId = req.user._id;
    const {
      requestId,
      qualityOfWorkRating,
      punctualityRating,
      communicationRating,
      mannerRating,
      personalComment,
    } = req.body.data;
    const requestDetails = await requestDataAccess.getFullRequestDetails(requestId);

    const awardedTasker =
      requestDetails._awardedBidRef && requestDetails._awardedBidRef._taskerRef._id;
    if (!awardedTasker) {
      return res.status(403).send({
        safeMsg: 'Only the Tasker who fulfilled the request can perform this action',
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
        safeMsg: 'You have already submit a review.',
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
  } catch (e) {
    e.safeMsg =
      'some error occurred, please chat with our customer support using the chat button at the bottom of the page';
    return next(e);
  }
};
