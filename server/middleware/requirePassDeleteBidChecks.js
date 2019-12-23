const { bidDataAccess } = require('../data-access/bidDataAccess');

module.exports = async (req, res, next) => {
  try {
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
