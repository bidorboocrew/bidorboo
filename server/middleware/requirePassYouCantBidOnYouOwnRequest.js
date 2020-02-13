const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bugsnagClient } = require('../utils/utilities');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;

    const userId = req.user._id.toString();
    const requestOwner = await requestDataAccess.isRequestOwner(userId, requestId);
    if (requestOwner && requestOwner._id) {
      return res.status(403).send({ safeMsg: "You can't bid on your own request." });
    } else {
      next();
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = 'failed to validate request owner details';
    return next(e);
  }
};
