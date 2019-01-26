const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requiresCheckPayBidderDetails = require('../middleware/requiresCheckPayBidderDetails');
const requireJobOwner = require('../middleware/requireJobOwner');
const requireJobIsNotAwarded = require('../middleware/requireJobIsNotAwarded');
const userDataAccess = require('../data-access/userDataAccess');
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const stripeServiceUtil = require('../services/stripeService').util;
const requireUserHasAStripeAccount = require('../middleware/requireUserHasAStripeAccount');

const { paymentDataAccess } = require('../data-access/paymentDataAccess');
const { jobDataAccess } = require('../data-access/jobDataAccess');

const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

module.exports = (app) => {
  app.post(
    ROUTES.API.PAYMENT.POST.payment,
    requireBidorBooHost,
    requireLogin,
    requireJobOwner,
    requireJobIsNotAwarded,
    requiresCheckPayBidderDetails,
    async (req, res) => {
      try {
        const { stripeTransactionToken, chargeAmount } = req.body.data;
        // requiresPayBidderCheck will ensure we are setup
        const { _jobRef, _id, _bidderRef, bidAmount } = res.locals.bidOrBooPayBider.theBid;

        let stripeAccDetails = await userDataAccess.getUserStripeAccount(_bidderRef._id.toString());

        if (stripeAccDetails.accId) {
          /**
           * chargeAmount already includes the 6% charged to the end user
           * so we need to do :
           * BidOrBoo charges proposer 6%
           * BidOrBoo charges Bidder 4%
           *
           * chargeAmount passed in includes the 6% charge on the proposer
           *
           */

          const originalBidAmount = bidAmount.value * 100;

          const bidOrBooChargeOnBidder = Math.ceil(originalBidAmount * 0.04);
          const bidOrBooChargeOnProposer = chargeAmount - originalBidAmount; //100 as we expect in cents
          const bidOrBooTotalCommission = bidOrBooChargeOnBidder + bidOrBooChargeOnProposer;

          const bidderPayoutAmount = chargeAmount - bidOrBooTotalCommission;

          const description = `BidOrBoo - Service Charge for your ${
            _jobRef.fromTemplateId
          } request was recieved.`;

          const charge = await stripe.charges.create({
            statement_descriptor: 'BidOrBoo Charge',
            amount: chargeAmount,
            currency: 'CAD',
            description,
            source: stripeTransactionToken,
            destination: {
              amount: bidderPayoutAmount, // the final # sent to awarded bidder
              account: stripeAccDetails.accId,
            },
            receipt_email: _jobRef._ownerRef.email.emailAddress,
            metadata: {
              bidderId: _bidderRef._id.toString(),
              bidderEmail: _bidderRef.email.emailAddress,
              proposerId: req.user._id.toString(),
              proposerEmail: _jobRef._ownerRef.email.emailAddress,
              jobId: _jobRef._id.toString(),
              bidId: _id.toString(),
            },
          });
          if (charge && charge.status === 'succeeded') {
            // update the job and bidder with the chosen awarded bid
            const updateJobAndBid = await jobDataAccess.updateJobAwardedBid(
              _jobRef._id.toString(),
              _id.toString()
            );
            const awardedBidder = _bidderRef.userId
              ? await userDataAccess.getUserPushSubscription(_bidderRef.userId)
              : false;
            if (awardedBidder && awardedBidder.pushSubscription) {
              // send push
              const bidId = _id.toString();
              WebPushNotifications.sendPush(awardedBidder.pushSubscription, {
                title: `Good News ${_bidderRef.displayName}!`,
                body: `You have been awarded a job. click for details`,
                urlToLaunch: `https://www.bidorboo.com/bidder/awarded-bid-details/${bidId}`,
              });
            }
            res.send({ success: true });
          }
        } else {
          return res.status(400).send({
            errorMsg: 'Did Not Process the payment. Could not locate the bidder Account info',
          });
        }
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To create charge', details: `${e}` });
      }
    }
  );

  app.get(ROUTES.API.PAYMENT.GET.payment, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      const paymentsDetails = await paymentDataAccess.getAllPaymentsDetails();

      res.send({ paymentsDetails: paymentsDetails });
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To create charge', details: `${e}` });
    }
  });

  app.post(ROUTES.API.PAYMENT.POST.myaccountWebhook, async (req, res) => {
    try {
      return res.status(200).send();
    } catch (e) {
      return res.status(500).send({ errorMsg: 'myaccountWebhook failured', details: `${e}` });
    }
  });
  app.post(ROUTES.API.PAYMENT.POST.connectedAccountsWebhook, async (req, res) => {
    try {
      return res.status(200).send();
    } catch (e) {
      return res
        .status(500)
        .send({ errorMsg: 'connectedAccountsWebhook failured', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.PAYMENT.PUT.setupPaymentDetails,
    requireBidorBooHost,
    requireLogin,
    requireUserHasAStripeAccount,
    async (req, res) => {
      try {
        const userId = req.user.userId;

        const reqData = req.body.data;
        const { connectedAccountDetails, last4BankAcc } = reqData;
        const { stripeConnectAccId } = res.locals.bidOrBoo;
        const connectedAccount = await stripeServiceUtil.updateStripeConnectedAccountDetails(
          stripeConnectAccId,
          connectedAccountDetails
        );
        const updatedUser = await userDataAccess.updateUserProfileDetails(userId, {
          agreedToServiceTerms: true,
          'stripeConnect.last4BankAcc': last4BankAcc,
          // membershipStatus: 'VERIFIED_MEMBER',
        });
        return res.send({ success: true, updatedUser: updatedUser });
      } catch (e) {
        return res.status(500).send({ errorMsg: e });
      }
    }
  );
};
