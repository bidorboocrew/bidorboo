const { bidDataAccess } = require('../data-access/bidDataAccess');
const userDataAccess = require('../data-access/userDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

/**
 * bunch of confirmation checks to ensure that we do not charge until all details match up
 */
module.exports = async (req, res, next) => {
  try {
    const { stripeTransactionToken, bidId, chargeAmount, jobId } = req.body.data;
    if (!stripeTransactionToken || !bidId || !chargeAmount) {
      return res.status(403).send({ errorMsg: 'We did NOT process the payment. missing params' });
    }

    const theBid = await bidDataAccess.getBidById(bidId);
    if (!theBid || !theBid._id) {
      return res
        .status(403)
        .send({ errorMsg: 'Bid can not be found did NOT process the payment.' });
    }
    const { _bidderRef, bidAmount } = theBid;

    const BIDORBOO_SERVICECHARGE = 0.06;

    // confirm award and pay
    const originalCharge = bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(originalCharge * BIDORBOO_SERVICECHARGE);
    const totalAmount = (originalCharge + bidOrBooServiceFee) * 100;

    if (totalAmount !== chargeAmount) {
      return res
        .status(403)
        .send({ errorMsg: 'payment amount mismatch. we did NOT process the payment.' });
    }

    if (theBid._jobRef.toString() !== jobId) {
      return res.status(403).send({
        errorMsg:
          'payment can not be processed as the job field does not match the selected job. we did NOT process the payment.',
      });
    }

    let stripeAccDetails = await userDataAccess.getUserStripeAccount(_bidderRef._id.toString());

    if (!stripeAccDetails.accId) {
      // user does not have a stripe account , we must establish one
      const newStripeConnectAcc = await stripeServiceUtil.initializeConnectedAccount({
        user_id: _bidderRef._id.toString(),
        userId: _bidderRef.userId,
        displayName: _bidderRef.displayName,
        email: _bidderRef.email.emailAddress,
      });
      if (newStripeConnectAcc.id) {
        const updateUser = await userDataAccess.findByUserIdAndUpdate(_bidderRef.userId, {
          stripeConnect: {
            accId: newStripeConnectAcc.id,
          },
        });
        stripeAccDetails = updateUser.stripeConnect;
      } else {
        return res.status(400).send({
          errorMsg:
            'The bidder does not have a stripe accoutn with us. Sorry we can not process yoru payment for this bidder',
        });
      }
    }
    if (stripeAccDetails.accId) {
      // maybe add a check that recieving user has stripe account setup
      res.locals.bidOrBooPayBider = {
        theBid,
        chargeAmount,
      };
      next();
    } else {
      return res.status(400).send({
        errorMsg:
          'The bidder does not have a stripe accoutn with us. Sorry we can not process yoru payment for this bidder',
      });
    }
  } catch (e) {
    return res.status(500).send({
      errorMsg: 'We did NOT process the payment. failed to meet requirements to process payment',
      details: e,
    });
  }
};
