const { bidDataAccess } = require('../data-access/bidDataAccess');
const { bugsnagClient } = require('../utils/utilities');

module.exports = async (req, res, next) => {
  try {
    const { data } = req.body;

    const { bidId } = data;

    const newBid = await bidDataAccess.getBidById(bidId);
    if (!newBid) {
      return res.status(400).send({
        errorMsg: 'Bad Request post new Bid, missing param',
      });
    } else {
      if (newBid.isNewBid) {
        return next();
      } else {
        return res.status(400).send({
          safeMsg:
            'Sorry, you can not change the bid amount because the requester had seen it or is currently viewing it',
        });
      }
    }
  } catch (e) {
    bugsnagClient.notify(e);
    e.safeMsg = 'Bad Request post new Bid, missing param';
    return next(e);
  }
};
