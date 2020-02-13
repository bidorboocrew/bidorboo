const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bugsnagClient } = require('../utils/utilities');;

module.exports = async (req, res, next) => {
  try {
    const { requestId } = req.body.data;

    const request = await requestDataAccess.getBidsList(requestId);
    if (!request || !request._id) {
      return res.status(403).send({ safeMsg: 'We could not locate the request.' });
    }

    if (!request._bidsListRef || !request._bidsListRef.length > 0) {
      next();
    } else {
      let hasUserAlreadyBid = request._bidsListRef.some((bid) => {
        return bid._taskerRef._id.toString() === req.user._id.toString();
      });
      if (hasUserAlreadyBid) {
        return res.status(403).send({ safeMsg: 'You Already Bid on this request.' });
      } else {
        next();
      }
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = 'Sorry , try to refresh the page and place your bid again.';
    return next(e);
  }
};
