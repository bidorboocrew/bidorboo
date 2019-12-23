const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    const { requestId } = req.body.data;

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
    return res.status(400).send({
      errorMsg: 'Sorry , try to refresh the page and place your bid again.',
      details: `${e}`,
    });
  }
};
