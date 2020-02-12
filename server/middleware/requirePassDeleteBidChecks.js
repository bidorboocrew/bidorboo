const { bidDataAccess } = require('../data-access/bidDataAccess');
const { bugsnagClient } = require('../index');

module.exports = async (req, res, next) => {
  try {
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
