const { bidDataAccess } = require('../data-access/bidDataAccess');
const requireUserHasNotAlreadyBidOnJob = require('../middleware/requireUserHasNotAlreadyBidOnJob');
const requireUserCanBid = require('../middleware/requireUserCanBid');
const requireBidAmountIsNotLocked = require('../middleware/requireBidAmountIsNotLocked');

const requireBidOwner = require('../middleware/requireBidOwner');

const requirePassYouCantBidOnYouOwnRequest = require('../middleware/requirePassYouCantBidOnYouOwnRequest');
const requirePassesRecaptcha = require('../middleware/requirePassesRecaptcha');
const requireJobIsNotAwarded = require('../middleware/requireJobIsNotAwarded');
const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requirePassDeleteBidChecks = require('../middleware/requirePassDeleteBidChecks');

module.exports = (app) => {
  app.get(ROUTES.API.BID.GET.myAwardedBids, requireLogin, async (req, res) => {
    try {
      const mongoUser_id = req.user._id;
      const userBidsList = await bidDataAccess.getUserAwardedBids(mongoUser_id);
      return res.send(userBidsList);
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To get my all My PostedBids bids', details: `${e}` });
    }
  });
  app.delete(
    ROUTES.API.BID.DELETE.deleteOpenBid,
    requireLogin,
    requirePassDeleteBidChecks,
    async (req, res) => {
      try {
        const mongoUser_id = req.user._id.toString();
        const { bidId } = req.body;

        const deleteResults = await bidDataAccess.deleteOpenBid(mongoUser_id, bidId);
        return res.send(deleteResults);
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To delete Open Bid', details: `${e}` });
      }
    }
  );

  app.delete(
    ROUTES.API.BID.DELETE.cancelAwardedBid,
    requireLogin,
    requirePassDeleteBidChecks,
    async (req, res) => {
      try {
        const mongoUser_id = req.user._id.toString();
        const { bidId } = req.body;

        const deleteResults = await bidDataAccess.cancelAwardedBid(mongoUser_id, bidId);
        return res.send(deleteResults);
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To cancel Awarded Bid', details: `${e}` });
      }
    }
  );
  app.get(ROUTES.API.BID.GET.openBidDetails, requireLogin, async (req, res, done) => {
    try {
      if (req.query && req.query.openBidId) {
        const { openBidId } = req.query;
        const mongoUser_id = req.user._id;
        const userBid = await bidDataAccess.getBidDetails(mongoUser_id, openBidId);
        return res.send(userBid);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request for get open Bid Details, openBidId param was Not Specified',
        });
      }
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To get my open bid details', details: `${e}` });
    }
  });

  app.get(ROUTES.API.BID.GET.awardedBidDetails, requireLogin, async (req, res, done) => {
    try {
      if (req.query && req.query.awardedBidId) {
        const { awardedBidId } = req.query;
        const mongoUser_id = req.user._id;
        const userBid = await bidDataAccess.getAwardedBidDetailsForTasker(mongoUser_id, awardedBidId);
        return res.send(userBid);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request for get awarded Bid Details, openBidId param was Not Specified',
        });
      }
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To get my awarded bid details', details: `${e}` });
    }
  });

  app.post(
    ROUTES.API.BID.POST.bid,
    requireLogin,
    requirePassesRecaptcha,
    requirePassYouCantBidOnYouOwnRequest,
    requireUserCanBid,
    requireJobIsNotAwarded,
    requireUserHasNotAlreadyBidOnJob,
    async (req, res) => {
      try {
        // create new job for this user
        const { data } = req.body;

        if (data && data.bidAmount && data.jobId) {
          const { jobId, bidAmount } = data;

          const mongoUser_id = req.user._id;

          const newBid = await bidDataAccess.postNewBid({
            mongoUser_id,
            jobId,
            bidAmount,
          });
          return res.send(newBid);
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request post new Bid, missing param',
          });
        }
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To post a new bid', details: `${e}` });
      }
    }
  );

  app.post(
    ROUTES.API.BID.PUT.updateMyBid,
    requireLogin,
    requireUserCanBid,
    requireBidOwner,
    requireBidAmountIsNotLocked,
    async (req, res, done) => {
      try {
        // create new job for this user
        const { data } = req.body;

        if (data && data.bidAmount && data.bidId) {
          const { bidId, bidAmount } = data;

          const mongoUser_id = req.user._id.toString();

          const newBid = await bidDataAccess.updateBidValue({
            mongoUser_id,
            bidId,
            bidAmount,
          });
          return res.send(newBid);
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request post new Bid, missing param',
          });
        }
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To update your bid', details: `${e}` });
      }
    }
  );

  app.put(ROUTES.API.BID.PUT.markBidAsSeen, requireLogin, async (req, res, done) => {
    try {
      // create new job for this user
      const data = req.body.data;
      const { bidId } = data;

      if (bidId) {
        const newBid = await bidDataAccess.markBidAsSeen(bidId);
        return res.send({ bidId, success: true });
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request param bidId was Not Specified',
        });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To post a new bid', details: `${e}` });
    }
  });

  // everything below this line is optimal--------------------------------------------
  app.get(ROUTES.API.BID.GET.myPostedBidsSummary, requireLogin, async (req, res, done) => {
    try {
      const mongoUser_id = req.user._id;
      const userBidsList = await bidDataAccess.getMyPostedBidsSummary(mongoUser_id);
      return res.send(userBidsList);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get my open bids', details: `${e}` });
    }
  });
};
