const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;

    const userId = req.user._id.toString();
    const requestOwner = await requestDataAccess.isRequestOwner(userId, requestId);
    if (requestOwner && requestOwner._id) {
      return res.status(403).send({ errorMsg: "You can't bid on your own request." });
    } else {
      next();
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate request owner details', details: `${e}` });
  }
};
