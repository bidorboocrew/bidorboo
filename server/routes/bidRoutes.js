const { celebrate } = require('celebrate');

const {
  deleteOpenBid,
  cancelAwardedBid,
  openBidDetails,
  awardedBidDetailsForTasker,
  createNewBid,
  updateMyBid,
  markBidAsSeen,
  achivedBidDetailsForTasker,
} = require('../routeSchemas/bidRoutesSchema');

const { bidDataAccess } = require('../data-access/bidDataAccess');
const requireUserHasNotAlreadyBidOnRequest = require('../middleware/requireUserHasNotAlreadyBidOnRequest');
const requireUserCanBid = require('../middleware/requireUserCanBid');
const requireBidAmountIsNotLocked = require('../middleware/requireBidAmountIsNotLocked');

const requireBidOwner = require('../middleware/requireBidOwner');

const requirePassYouCantBidOnYouOwnRequest = require('../middleware/requirePassYouCantBidOnYouOwnRequest');
const requirePassesRecaptcha = require('../middleware/requirePassesRecaptcha');
const requireRequestIsNotAwarded = require('../middleware/requireRequestIsNotAwarded');

const requireRequestOwner = require('../middleware/requireRequestOwner');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requirePassDeleteBidChecks = require('../middleware/requirePassDeleteBidChecks');

module.exports = (app) => {
  app.delete(
    ROUTES.API.BID.DELETE.deleteOpenBid,
    requireLogin,
    celebrate(deleteOpenBid),
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
    celebrate(cancelAwardedBid),
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
  app.get(
    ROUTES.API.BID.GET.openBidDetails,
    requireLogin,
    celebrate(openBidDetails),
    async (req, res, done) => {
      try {
        const { openBidId } = req.query;
        const mongoUser_id = req.user._id;
        const userBid = await bidDataAccess.getBidDetails(mongoUser_id, openBidId);
        return res.send(userBid);
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To get my open bid details', details: `${e}` });
      }
    }
  );

  app.get(
    ROUTES.API.BID.GET.awardedBidDetailsForTasker,
    requireLogin,
    celebrate(awardedBidDetailsForTasker),
    async (req, res, done) => {
      try {
        const { awardedBidId } = req.query;
        const mongoUser_id = req.user._id;
        const userBid = await bidDataAccess.getAwardedBidDetailsForTasker(
          mongoUser_id,
          awardedBidId
        );
        return res.send(userBid);
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To get my awarded bid details', details: `${e}` });
      }
    }
  );

  app.post(
    ROUTES.API.BID.POST.createNewBid,
    requireLogin,
    celebrate(createNewBid),
    requirePassesRecaptcha,
    requirePassYouCantBidOnYouOwnRequest,
    requireUserCanBid,
    requireRequestIsNotAwarded,
    requireUserHasNotAlreadyBidOnRequest,
    async (req, res) => {
      try {
        const { data } = req.body;
        const { requestId, bidAmount } = data;
        const mongoUser_id = req.user._id;
        const newBid = await bidDataAccess.postNewBid({
          mongoUser_id,
          requestId,
          bidAmount,
        });
        return res.send(newBid);
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To post a new bid', details: `${e}` });
      }
    }
  );

  app.post(
    ROUTES.API.BID.PUT.updateMyBid,
    requireLogin,
    celebrate(updateMyBid),
    requireUserCanBid,
    requireBidOwner,
    requireBidAmountIsNotLocked,
    async (req, res, done) => {
      try {
        const { data } = req.body;
        const { bidId, bidAmount } = data;
        const mongoUser_id = req.user._id.toString();
        const newBid = await bidDataAccess.updateBidValue({
          mongoUser_id,
          bidId,
          bidAmount,
        });
        return res.send(newBid);
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To update your bid', details: `${e}` });
      }
    }
  );

  app.put(
    ROUTES.API.BID.PUT.markBidAsSeen,
    requireLogin,
    celebrate(markBidAsSeen),
    requireRequestOwner,
    async (req, res, done) => {
      try {
        // create new request for this user
        const data = req.body.data;
        const { bidId } = data;

        await bidDataAccess.markBidAsSeen(bidId);
        return res.send({ bidId, success: true });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To post a new bid', details: `${e}` });
      }
    }
  );

  // everything below this line is optimal--------------------------------------------
  app.get(ROUTES.API.BID.GET.myPostedBidsSummary, requireLogin, async (req, res, done) => {
    try {
      const mongoUser_id = req.user._id;
      const postedBidsSummary = await bidDataAccess.getMyPostedBidsSummary(mongoUser_id);
      return res.send({ postedBidsSummary });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get my open bids', details: `${e}` });
    }
  });

  app.get(
    ROUTES.API.BID.GET.achivedBidDetailsForTasker,
    requireLogin,
    celebrate(achivedBidDetailsForTasker),
    requireBidOwner,
    async (req, res) => {
      try {
        const mongoUser_id = req.user._id;
        const { bidId } = req.query;
        const archivedRequestDetails = await bidDataAccess.getAchivedBidDetailsForTasker({
          bidId,
          mongoUser_id,
        });
        return res.send(archivedRequestDetails);
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To get Bid details', details: `${e}` });
      }
    }
  );
};
