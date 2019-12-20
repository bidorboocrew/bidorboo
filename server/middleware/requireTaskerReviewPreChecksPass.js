const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bidDataAccess } = require('../data-access/bidDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const taskerId = req.user._id;
      const {
        requestId,
        accuracyOfPostRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !requestId ||
        !accuracyOfPostRating ||
        !punctualityRating ||
        !communicationRating ||
        !mannerRating ||
        !personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'missing paramerters . can not pass requireTaskerReviewPreChecksPass.',
        });
      }
      const { bidId } = res.locals.bidOrBoo;
      if (!bidId) {
        return res.status(403).send({
          errorMsg: 'could not locate your bid. try again later',
        });
      }
      const bid = await bidDataAccess.getAwardedBidDetails(taskerId, bidId);
      if (!bid || !bid._id || !bid._requestRef || !bid._requestRef._id) {
        return res.status(403).send({ errorMsg: 'Could not find the specified bid.' });
      }
      const request = bid._requestRef;

      res.locals.bidOrBoo = res.locals.bidOrBoo || {};
      res.locals.bidOrBoo.requesterId = request._ownerRef._id;
      res.locals.bidOrBoo.taskerId = bid._taskerRef;

      if (request._reviewRef) {
        if (request._reviewRef.taskerReview && request._reviewRef.taskerReview.personalComment) {
          return res.status(403).send({
            errorMsg: 'You have already submit a review.',
          });
        } else {
          next();
        }
      } else {
        await requestDataAccess.kickStartReviewModel({
          requestId: request._id,
          taskerId: res.locals.bidOrBoo.taskerId,
          requesterId: res.locals.bidOrBoo.requesterId,
        });
        next();
      }
    } else {
      return res.status(403).send({ errorMsg: 'only logged in users can perform this operation.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'failed to pass requireTaskerReviewPreChecksPass',
      details: `${e}`,
    });
  }
};
