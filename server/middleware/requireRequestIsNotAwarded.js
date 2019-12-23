const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;

    const request = await requestDataAccess.getRequestById(requestId);
    if (!request || !request._id) {
      return res.status(403).send({ errorMsg: 'We could not locate the request.' });
    }

    if (!request._awardedBidRef) {
      next();
    } else {
      return res
        .status(403)
        .send({ errorMsg: 'Sorry , The Requester had already awarded this task to somebody.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate if this task is awarded ', details: `${e}` });
  }
};
