const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bugsnagClient } = require('../utils/utilities');;

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;

    const request = await requestDataAccess.getRequestById(requestId);
    if (!request || !request._id) {
      return res.status(403).send({ safeMsg: 'We could not locate the request.' });
    }

    if (!request._awardedBidRef) {
      next();
    } else {
      return res
        .status(403)
        .send({ safeMsg: 'Sorry , The Requester had already awarded this task to somebody.' });
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = 'failed to validate if this task is awarded';
    return next(e);
  }
};
