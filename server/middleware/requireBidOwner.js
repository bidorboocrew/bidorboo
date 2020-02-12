const { bidDataAccess } = require('../data-access/bidDataAccess');
const bugsnagClient = require('../index').bugsnagClient;

module.exports = async (req, res, next) => {
  try {
    const { bidId } = (req.body && req.body.data) || req.query;

    if (bidId && req.user && req.user._id) {
      const mongoUser_id = req.user._id;

      const newBid = await bidDataAccess.findBidByOwner(mongoUser_id, bidId);
      if (!newBid) {
        return res.status(400).send({
          errorMsg: "We couldn't verify that you are the bid owner",
        });
      } else {
        return next();
      }
    }

    return res.status(400).send({
      safeMsg: 'Missing parameters, we can not complete this request',
    });
  } catch (e) {
    bugsnagClient.notify(e);
    e.safeMsg = 'you must be the bid owner to change its value';
    return next(e);
  }
};
