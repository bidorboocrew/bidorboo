const bidDataAccess = require('../data-access/bidDataAccess');

module.exports = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (data && data.bidId && req.user && req.user._id) {
      const { bidId } = data;
      const mongoUser_id = req.user._id;

      const newBid = await bidDataAccess.getBidDetails(mongoUser_id, bidId);
      if (!newBid) {
        return res.status(400).send({
          errorMsg: "We couldn't verify that you are the bid owner",
        });
      } else {
        next();
      }
    }

    return res.status(400).send({
      errorMsg: 'Missing parameters, we can not complete this request',
    });
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'you must be the bid owner to change its value',
    });
  }
};
