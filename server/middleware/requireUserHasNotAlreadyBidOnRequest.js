const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId || !req.user._id) {
      return res.status(401).send({ errorMsg: 'you must be logged in to perform this action.' });
    }
    //in the future redirect to login page
    const { requestId } = req.body.data;
    if (!requestId) {
      return res.status(403).send({ errorMsg: 'missing paramerters . can not validate the request.' });
    }

    const request = await requestDataAccess.getBidsList(requestId);
    if (!request || !request._id) {
      return res.status(403).send({ errorMsg: 'We could not locate the request.' });
    }

    if (!request._bidsListRef || !request._bidsListRef.length > 0) {
      next();
    } else {
      let hasUserAlreadyBid = request._bidsListRef.some((bid) => {
        return bid._taskerRef._id.toString() === req.user._id.toString();
      });
      if (hasUserAlreadyBid) {
        return res.status(403).send({ errorMsg: 'You Already Bid on this request.' });
      } else {
        next();
      }
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'Sorry , try to refresh the page and place your bid again.', details: `${e}` });
  }
};
