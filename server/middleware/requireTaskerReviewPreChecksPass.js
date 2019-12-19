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
      if (!bid || !bid._id || !bid._requestRef) {
        return res.status(403).send({ errorMsg: 'Could not find the specified bid.' });
      }

      const request = await requestDataAccess.getRequestWithReviewModel(requestId, bid._requestRef._ownerRef._id);

      if (request && request._id) {
        res.locals.bidOrBoo = res.locals.bidOrBoo || {};
        res.locals.bidOrBoo.requesterId = bid._requestRef._ownerRef._id;
        res.locals.bidOrBoo.taskerId = bid._taskerRef;

        if (request._reviewRef) {
          if (request._reviewRef.taskerReview) {
            return res
              .status(403)
              .send({ errorMsg: 'You have already submit a review on this request.' });
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
        return res.status(403).send({
          errorMsg:
            'failed requireTaskerReviewPreChecksPass cant find the request or the request owner does not correspond to the specified user in this request',
        });
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
