const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requiresCheckPayBidderDetails = require('../middleware/requiresCheckPayBidderDetails');
const requireJobOwner = require('../middleware/requireJobOwner');
const requireJobIsNotAwarded = require('../middleware/requireJobIsNotAwarded');
const userDataAccess = require('../data-access/userDataAccess');

const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const stripeServiceUtil = require('../services/stripeService').util;
const requireUserHasAStripeAccountOrInitalizeOne = require('../middleware/requireUserHasAStripeAccountOrInitalizeOne');
// const requireHasAnExistingStripeAcc = require('../middleware/requireHasAnExistingStripeAcc');

const { paymentDataAccess } = require('../data-access/paymentDataAccess');
const { jobDataAccess } = require('../data-access/jobDataAccess');

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedJobOwnerBidderAndRelevantNotificationDetails;

const keys = require('../config/keys');

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
          console.log('BidOrBooPayment - started');
          const originalBidAmount = bidAmount.value * 100;

          const bidOrBooChargeOnBidder = Math.ceil(originalBidAmount * 0.04);
          const bidOrBooChargeOnProposer = chargeAmount - originalBidAmount; //100 as we expect in cents
          const bidOrBooTotalCommission = bidOrBooChargeOnBidder + bidOrBooChargeOnProposer;

          const bidderPayoutAmount = chargeAmount - bidOrBooTotalCommission;

          const description = `BidOrBoo - Charge for your ${
            _jobRef.templateId
          } request was recieved.`;

          console.log('-------BidOrBooLogging----------------------');
          console.log('BidOrBooPayment - initiated charge details');
          console.log('BidOrBooPayment - BidOrBoo Fees ' + bidOrBooTotalCommission);
          console.log({
            bidOrBooChargeOnBidder,
            bidOrBooChargeOnProposer,
            bidOrBooTotalCommission,
            bidderId: _bidderRef._id.toString(),
            bidderEmail: _bidderRef.email.emailAddress,
            proposerId: req.user._id.toString(),
            proposerEmail: _jobRef._ownerRef.email.emailAddress,
            jobId: _jobRef._id.toString(),
            bidId: _id.toString(),
            note: `Requester Paid for  ${_jobRef.templateId}`,
          });
          console.log('-------BidOrBooLogging----------------------');
          const charge = await stripeServiceUtil.processDestinationCharge({
            statement_descriptor: 'BidOrBoo Charge',
            amount: chargeAmount,
            currency: 'CAD',
            description,
            receipt_email: _jobRef._ownerRef.email.emailAddress,
            source: stripeTransactionToken,
            // application_fee_amount: bidOrBooTotalCommission,
            transfer_data: {
              amount: bidderPayoutAmount, // the final # sent to awarded bidder
              destination: stripeAccDetails.accId,
            },
            metadata: {
              bidderId: _bidderRef._id.toString(),
              bidderEmail: _bidderRef.email.emailAddress,
              proposerId: req.user._id.toString(),
              proposerEmail: _jobRef._ownerRef.email.emailAddress,
              jobId: _jobRef._id.toString(),
              bidId: _id.toString(),
              note: `Requester Paid for  ${_jobRef.templateId}`,
            },
          });

          if (charge && charge.status === 'succeeded') {
            console.log('-------BidOrBooLogging----------------------');
            console.log('BidOrBooPayment - charge Succeeded');
            console.log('-------BidOrBooLogging----------------------');
            // update the job and bidder with the chosen awarded bid
            const updateJobAndBid = await jobDataAccess.updateJobAwardedBid(
              _jobRef._id.toString(),
              _id.toString(),
              {
                paymentSourceId: stripeTransactionToken,
                amount: charge.amount,
                chargeId: charge.id,
                bidderPayout: bidderPayoutAmount,
                platformCharge: bidOrBooTotalCommission,
                proposerPaid: chargeAmount,
                bidderStripeAcc: stripeAccDetails.accId,
              }
            );

            const {
              requesterDisplayName,
              taskerDisplayName,
              jobDisplayName,
              requestLinkForRequester,
              requestLinkForTasker,
              requesterEmailAddress,
              taskerEmailAddress,
              taskerPhoneNumber,
              allowedToEmailRequester,
              allowedToEmailTasker,
              allowedToTextTasker,
              allowedToPushNotifyTasker,
              taskerPushNotSubscription,
            } = await getAllContactDetails(_jobRef._id);

            if (allowedToEmailRequester) {
              sendGridEmailing.tellRequesterThanksforPaymentAndTaskerIsRevealed({
                to: requesterEmailAddress,
                requestTitle: jobDisplayName,
                toDisplayName: requesterDisplayName,
                linkForOwner: requestLinkForRequester,
              });
            }
            if (allowedToEmailTasker) {
              sendGridEmailing.tellTaskerThatTheyWereAwarded({
                to: taskerEmailAddress,
                requestTitle: jobDisplayName,
                toDisplayName: taskerDisplayName,
                linkForBidder: requestLinkForTasker,
              });
            }

            if (allowedToTextTasker) {
              sendTextService.sendJobIsAwardedText(
                taskerPhoneNumber,
                jobDisplayName,
                requestLinkForTasker
              );
            }

            if (allowedToPushNotifyTasker) {
              WebPushNotifications.pushYouAreAwarded(taskerPushNotSubscription, {
                taskerDisplayName: taskerDisplayName,
                urlToLaunch: requestLinkForTasker,
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
    async (req, res) => {
      try {
        const mongoUser_id = req.user._id.toString();

        let accDetails = [];
        const paymentsDetails = await userDataAccess.getUserStripeAccount(mongoUser_id);

        if (paymentsDetails && paymentsDetails.accId) {
          accDetails = await stripeServiceUtil.getConnectedAccountBalance(paymentsDetails.accId);
        }
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
  if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE !== '0') {
    /**
     * user verification
     * verification issues with image
     * https://stripe.com/docs/connect/payouts#using-manual-payouts
     */
    //xxxx
    app.post(ROUTES.API.PAYMENT.POST.connectedAccountsWebhook, async (req, res, next) => {
      try {
        console.log('-------BidOrBooLogging----------------------');
        console.log('connectedAccountsWebhook is triggered');
        console.log('-------BidOrBooLogging----------------------');
        // sign key by strip
        let endpointSecret = keys.stripeWebhookConnectedAccSig;
        let sig = req.headers['stripe-signature'];
        let event = stripeServiceUtil.validateSignature(req.body, sig, endpointSecret);
        if (event) {
          const { id, data } = event;

          if (data) {
            const customerAcc = data.object; //the user connected account is attached here
            if (customerAcc) {
              const {
                id: accId,
                payouts_enabled,
                charges_enabled,
                requirements: accRequirements,
                metadata,
              } = customerAcc;

              const { userId } = metadata;
              console.log('-------BidOrBooLogging----------------------');
              console.log('updateStripeAccountRequirementsDetails started');
              console.log({
                eventId: id,
                userId,
                accId,
                chargesEnabled: charges_enabled,
                payoutsEnabled: payouts_enabled,
                accRequirements,
              });

              await userDataAccess.updateStripeAccountRequirementsDetails({
                eventId: id,
                userId,
                accId,
                chargesEnabled: charges_enabled,
                payoutsEnabled: payouts_enabled,
                accRequirements,
              });
              console.log('updateStripeAccountRequirementsDetails done');
              console.log('-------BidOrBooLogging----------------------');
            }
          }
        }
        return res.status(200).send();
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'connectedAccountsWebhook failured', details: `${e}` });
      }
    });
    app.post(ROUTES.API.PAYMENT.POST.payoutsWebhook, async (req, res, next) => {
      try {
        console.log('payoutsWebhook is triggered');

        // sign key by strip
        let endpointSecret = keys.stripeWebhookPayoutAccSig;
        let sig = req.headers['stripe-signature'];
        let event = stripeServiceUtil.validateSignature(req.body, sig, endpointSecret);
        if (event) {
          const { id, account, type, data } = event;
          const { status, metadata } = data;
          const { jobId } = metadata;

          switch (type) {
            case 'payout.paid':
              console.log('payoutsWebhook payout.paid');
              console.log({ jobId });

              // update the job about this
              jobDataAccess.updateJobById(jobId, {
                $set: {
                  state: 'ARCHIVE',
                  'payoutDetails.status': status,
                },
              });
              //xxx inform user that it is paid via msg email..etc
              break;
            case 'payout.failed':
              console.log('payoutsWebhook payout.failed');
              console.log({ jobId });
              jobDataAccess.updateJobById(jobId, {
                $set: {
                  state: 'PAYMENT_TO_BANK_FAILED',
                  'payoutDetails.status': status,
                },
              });
              sendGridEmailing.informBobCrewAboutFailedPayment({ jobId, data });
              break;
          }
        }
        return res.status(200).send();
      } catch (e) {
        return res.status(400).send({ errorMsg: 'payoutsWebhook failured', details: `${e}` });
      }
    });
  }
};
