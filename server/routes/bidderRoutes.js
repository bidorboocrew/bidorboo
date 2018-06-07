const { bidDataAccess } = require('../data-access/bidDataAccess');

const ROUTES = require('../backend_route_constants');

const requireLogin = require('../middleware/requireLogin');


module.exports = app => {
  app.get(
    ROUTES.USERAPI.BIDDER_ROUTES.get_all_my_bids,
    requireLogin,
    async (req, res, done) => {
      try {
        // create new job for this user
        const userMongoDBId = req.user._id;

        const userBidsList = await bidDataAccess.getAllBidsForUser(userMongoDBId);
        res.send(userBidsList);
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

  app.post(
    ROUTES.USERAPI.BIDDER_ROUTES.post_a_bid,
    requireLogin,
    async (req, res, done) => {
      try {
        // create new job for this user
        const data = req.body.data;
        const userMongoDBId = req.user._id;
        const jobId = data.jobId;
        const bidAmount = data.bidAmount;

        const newBid = await bidDataAccess.postNewBid({
          bidderId: userMongoDBId,
          jobId: jobId,
          bidAmount: bidAmount
        });
        res.send(newBid);
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );
};
