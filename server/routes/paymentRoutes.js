const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requiresCheckPayBidderDetails = require('../middleware/requiresCheckPayBidderDetails');
const requireJobOwner = require('../middleware/requireJobOwner');
const requireJobIsNotAwarded = require('../middleware/requireJobIsNotAwarded');
const userDataAccess = require('../data-access/userDataAccess');
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;
const requirePassesRecaptcha = require('../middleware/requirePassesRecaptcha');

const stripeServiceUtil = require('../services/stripeService').util;
const requireUserHasAStripeAccountOrInitalizeOne = require('../middleware/requireUserHasAStripeAccountOrInitalizeOne');
const requireHasAnExistingStripeAcc = require('../middleware/requireHasAnExistingStripeAcc');

const { paymentDataAccess } = require('../data-access/paymentDataAccess');
const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = (app) => {
  app.post(
    ROUTES.API.PAYMENT.POST.payment,
    requireBidorBooHost,
    requireLogin,
    requirePassesRecaptcha,
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

          const description = `BidOrBoo - Service Charge for ${
            _jobRef.fromTemplateId
          }`;

          const charge = await stripeServiceUtil.processDestinationCharge({
            statement_descriptor: 'BidOrBoo Charge',
            amount: chargeAmount,
            currency: 'CAD',
            description,
            source: stripeTransactionToken,
            // application_fee_amount: bidOrBooTotalCommission,
            transfer_data: {
              amount: bidderPayoutAmount, // the final # sent to awarded bidder
              destination: stripeAccDetails.accId,
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
              _id.toString(),
              {
                amount: charge.amount,
                chargeId: charge.id,
                bidderPayout: bidderPayoutAmount,
                platformCharge: bidOrBooTotalCommission,
                proposerPaid: chargeAmount,
                bidderStripeAcc: stripeAccDetails.accId,
              }
            );
            const awardedBidder = _bidderRef.userId
              ? await userDataAccess.getUserPushSubscription(_bidderRef.userId)
              : false;
            if (
              awardedBidder &&
              awardedBidder.pushSubscription &&
              _bidderRef.notifications &&
              _bidderRef.notifications.push
            ) {
              // send push
              const bidId = _id.toString();
              WebPushNotifications.pushYouAreAwarded(awardedBidder.pushSubscription, {
                displayName: _bidderRef.displayName,
                urlToLaunch: `https://www.bidorboo.com/awarded-bid-details/${bidId}`,
              });
            }
            // xxxxxxx send email send text

            res.send({ success: true });
          }
        } else {
          return res.status(400).send({
            errorMsg: 'Did Not Process the payment. Could not locate the bidder Account info',
          });
        }
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To create charge', details: `${e}` });
      }
    }
  );

  app.get(ROUTES.API.PAYMENT.GET.payment, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      const paymentsDetails = await paymentDataAccess.getAllPaymentsDetails();

      res.send({ paymentsDetails: paymentsDetails });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To create charge', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.PAYMENT.PUT.setupPaymentDetails,
    requireBidorBooHost,
    requireLogin,
    requireUserHasAStripeAccountOrInitalizeOne,
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
        return res.status(400).send({ errorMsg: e });
      }
    }
  );

  app.get(
    ROUTES.API.PAYMENT.GET.myStripeAccountDetails,
    requireBidorBooHost,
    requireLogin,
    requireHasAnExistingStripeAcc,
    async (req, res) => {
      try {
        const mongoUser_id = req.user._id.toString();

        const paymentsDetails = await userDataAccess.getUserStripeAccount(mongoUser_id);

        const accDetails = await stripeServiceUtil.getConnectedAccountBalance(
          paymentsDetails.accId
        );

        let verifiedAmount = 0;
        let pendingVerificationAmount = 0;
        let paidoutAmount = 0;

        if (accDetails && accDetails.length === 2) {
          const accountBalance = accDetails[0];
          const accountPayouts = accDetails[1];

          accountBalance.available &&
            accountBalance.available.forEach((availableCash) => {
              verifiedAmount += availableCash.amount;
            });

          accountBalance.pending &&
            accountBalance.pending.forEach((pendingCash) => {
              pendingVerificationAmount += pendingCash.amount;
            });

          accountPayouts.data &&
            accountPayouts.data.forEach((paidoutCash) => {
              paidoutAmount += paidoutCash.amount;
            });
        }

        return res.send({
          balanceDetails: {
            verifiedAmount: verifiedAmount / 100,
            pendingVerificationAmount: pendingVerificationAmount / 100,
            potentialFuturePayouts: (verifiedAmount + pendingVerificationAmount) / 100,
            pastEarnings: paidoutAmount / 100,
          },
        });
      } catch (e) {
        return res.status(400).send({
          errorMsg: 'Failed To retrieve your connected stripe account details',
          details: `${e}`,
        });
      }
    }
  );

  app.post(ROUTES.API.PAYMENT.POST.myaccountWebhook, async (req, res, next) => {
    try {
      // sign key by strip
      // whsec_VqdFbVkdKx4TqPv3hDVDRwZvUwWlM3gG
      const endpointSecret = 'whsec_VqdFbVkdKx4TqPv3hDVDRwZvUwWlM3gG';
      let sig = req.headers['stripe-signature'];
      let event = stripeServiceUtil.validateSignature(req.body, sig, endpointSecret);
      return res.status(200).end();
    } catch (e) {
      return res.status(400).end();

      // return res.status(400).send({ errorMsg: 'myaccountWebhook failured', details: `${e}` });
    }
  });
  app.post(ROUTES.API.PAYMENT.POST.connectedAccountsWebhook, async (req, res, next) => {
    try {
      // sign key by strip
      // whsec_VqdFbVkdKx4TqPv3hDVDRwZvUwWlM3gG
      const endpointSecret = 'whsec_Y0IC3JsCypMml4DbTmHyeyA3wF0tbFV6';
      let sig = req.headers['stripe-signature'];
      let event = stripeServiceUtil.validateSignature(req.body, sig, endpointSecret);

      return res.status(200).end();
    } catch (e) {
      return res.status(400).end();

      // return res.status(400).send({ errorMsg: 'myaccountWebhook failured', details: `${e}` });
    }
  });
};
