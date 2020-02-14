const { bidDataAccess } = require('../data-access/bidDataAccess');
const { bugsnagClient } = require('../utils/utilities');

module.exports = async (req, res, next) => {
  try {
    const { bidId } = (req.body && req.body.data) || req.query;

    const bidDetails = await bidDataAccess.findBidByOwner(req.user._id, bidId);

    if (!bidDetails || !bidDetails._id) {
      return res.status(403).send({ safeMsg: 'We could not locate the bid. No changes were made' });
    }

    next();
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = 'failed to pass delete bid checks';
    return next(e);
  }
};
