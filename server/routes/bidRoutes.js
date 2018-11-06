const { bidDataAccess } = require('../data-access/bidDataAccess');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');

module.exports = (app) => {
  app.get(ROUTES.API.BID.GET.myBids, requireLogin, async (req, res, done) => {
    try {
      const userMongoDBId = req.user._id;

      const userBidsList = await bidDataAccess.getAllBidsForUser(userMongoDBId);
      return res.send(userBidsList);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get my bids', details: e });
    }
  });

  app.post(ROUTES.API.BID.POST.bid, requireLogin, async (req, res, done) => {
    try {
      // create new job for this user
      const data = req.body.data;
      const userMongoDBId = req.user._id;
      const userId = req.user.userId;
      const jobId = data.jobId;
      const bidAmount = data.bidAmount;

      const newBid = await bidDataAccess.postNewBid({
        userId: userId,
        bidderId: userMongoDBId,
        jobId: jobId,
        bidAmount: bidAmount,
      });
      return res.send(newBid);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To post a new bid', details: e });
    }
  });

  app.put(ROUTES.API.BID.PUT.markBidAsSeen, requireLogin, async (req, res, done) => {
    try {
      // create new job for this user
      const data = req.body.data;
      const { bidId } = data;

      if (bidId) {
        const newBid = await bidDataAccess.markBidAsSeen(bidId);
        return res.send({ bidId, success: '1' });
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request param bidId was Not Specified',
        });
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To post a new bid', details: e });
    }
  });
};
