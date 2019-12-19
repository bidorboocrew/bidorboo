const { bidDataAccess } = require('../data-access/bidDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId || !req.user._id) {
      return res.status(401).send({ errorMsg: 'you must be logged in to perform this action.' });
    }
    //in the future redirect to login page
    const { bidId } = req.body;
    if (!bidId) {
      return res.status(403).send({ errorMsg: 'missing paramerters . can not delete bid.' });
    }

    const bidDetails = await bidDataAccess.findBidByOwner(req.user._id, bidId);

    if (!bidDetails || !bidDetails._id) {
      return res
        .status(403)
        .send({ errorMsg: 'We could not locate the bid. No changes were made' });
    }

    next();
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate requirePassDeleteBidChecks ', details: `${e}` });
  }
};
