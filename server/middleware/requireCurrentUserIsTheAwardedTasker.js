const { requestDataAccess } = require('../data-access/requestDataAccess');
const bugsnagClient = require('../index').bugsnagClient;
module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;

    const mongoUser_id = req.user._id.toString();
    const request = await requestDataAccess.isAwardedTasker(mongoUser_id, requestId);

    if (
      request._awardedBidRef &&
      request._awardedBidRef._taskerRef._id.toString() === mongoUser_id
    ) {
      res.locals.bidOrBoo = {
        bidId: request._awardedBidRef._id,
      };
      next();
    } else {
      return res
        .status(403)
        .send({ safeMsg: 'only the awarded Tasker can perform this operation.' });
    }
  } catch (e) {
    bugsnagClient.notify(e);
    e.safeMsg = 'failed to validate is awarded Tasker';
    return next(e);
  }
};
