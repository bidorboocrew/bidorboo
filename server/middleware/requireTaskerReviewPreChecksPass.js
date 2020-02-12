const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bidDataAccess } = require('../data-access/bidDataAccess');
const { bugsnagClient } = require('../index');

module.exports = async (req, res, next) => {
  try {
    const taskerId = req.user._id;

    const { bidId } = res.locals.bidOrBoo;
    if (!bidId) {
      return res.status(403).send({
        safeMsg: 'could not locate your bid. try again later',
      });
    }
    const bid = await bidDataAccess.getAwardedBidDetails(taskerId, bidId);
    if (!bid || !bid._id || !bid._requestRef || !bid._requestRef._id) {
      return res.status(403).send({ safeMsg: 'Could not find the specified bid.' });
    }
    const request = bid._requestRef;

    res.locals.bidOrBoo = res.locals.bidOrBoo || {};
    res.locals.bidOrBoo.requesterId = request._ownerRef._id;
    res.locals.bidOrBoo.taskerId = bid._taskerRef;

    if (request._reviewRef) {
      if (request._reviewRef.taskerReview && request._reviewRef.taskerReview.personalComment) {
        return res.status(403).send({
          safeMsg: 'You have already submit a review.',
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
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = `failed to pass Tasker Review Pre-Checks`;
    return next(e);
  }
};
