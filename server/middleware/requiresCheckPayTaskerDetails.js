const { bidDataAccess } = require('../data-access/bidDataAccess');
const userDataAccess = require('../data-access/userDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

/**
 * bunch of confirmation checks to ensure that we do not charge until all details match up
 */
module.exports = async (req, res, next) => {
  try {
    const { stripeTransactionToken, bidId, chargeAmount, requestId } = req.body.data;
    if (!stripeTransactionToken || !bidId || !chargeAmount) {
      return res.status(403).send({ safeMsg: 'We did NOT process the payment. missing params' });
    }

    const theBid = await bidDataAccess.getBidById(bidId);
    if (!theBid || !theBid._id) {
      return res.status(403).send({ safeMsg: 'Bid can not be found did NOT process the payment.' });
    }
    const { _taskerRef, bidAmount } = theBid;

    const BIDORBOO_SERVICECHARGE = 0.06;

    // confirm award and pay
    const originalCharge = bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(originalCharge * BIDORBOO_SERVICECHARGE);
    const totalAmount = (originalCharge + bidOrBooServiceFee) * 100;

    if (totalAmount !== chargeAmount) {
      return res
        .status(403)
        .send({ safeMsg: 'payment amount mismatch. we did NOT process the payment.' });
    }

    if (theBid._requestRef._id.toString() !== requestId) {
      return res.status(403).send({
        safeMsg:
          'payment can not be processed as the request field does not match the selected request. we did NOT process the payment.',
      });
    }

    let stripeAccDetails = await userDataAccess.getUserStripeAccount(_taskerRef._id.toString());

    if (!stripeAccDetails.accId) {
      // user does not have a stripe account , we must establish one
      const newStripeConnectAcc = await stripeServiceUtil.initializeConnectedAccount({
        user_id: _taskerRef._id.toString(),
        userId: _taskerRef.userId,
        displayName: _taskerRef.displayName,
        email: _taskerRef.email.emailAddress,
      });
      if (newStripeConnectAcc.id) {
        const updateUser = await userDataAccess.findByUserIdAndUpdate(_taskerRef.userId, {
          stripeConnect: {
            accId: newStripeConnectAcc.id,
          },
        });
        stripeAccDetails = updateUser.stripeConnect;
      } else {
        return res.status(400).send({
          safeMsg:
            'The tasker does not have a stripe accoutn with us. Sorry we can not process yoru payment for this tasker',
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
        safeMsg:
          'The tasker does not have a stripe accoutn with us. Sorry we can not process yoru payment for this tasker',
      });
    }
  } catch (e) {
    e.safeMsg = `We did NOT process the payment. failed to meet requirements to process payment`;
    return next(e);
  }
};
