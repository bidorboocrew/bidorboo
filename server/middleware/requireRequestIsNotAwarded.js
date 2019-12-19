const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;
    if (!requestId) {
      return res.status(403).send({ errorMsg: 'missing paramerters . can not validate the request.' });
    }

    const request = await requestDataAccess.getRequestById(requestId);
    if (!request || !request._id) {
      return res.status(403).send({ errorMsg: 'We could not locate the request.' });
    }

    if (!request._awardedBidRef) {
      next();
    } else {
      return res.status(403).send({ errorMsg: 'Sorry , The Requester had already awarded.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate requireRequestIsNotAwarded ', details: `${e}` });
  }
};
