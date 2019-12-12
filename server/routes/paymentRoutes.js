const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
// const requiresCheckPayBidderDetails = require('../middleware/requiresCheckPayBidderDetails');
const requireJobOwner = require('../middleware/requireJobOwner');
const requireNoPaymentProcessedForThisJobBefore = require('../middleware/requireNoPaymentProcessedForThisJobBefore');

const requireJobIsNotAwarded = require('../middleware/requireJobIsNotAwarded');
const userDataAccess = require('../data-access/userDataAccess');

const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const stripeServiceUtil = require('../services/stripeService').util;
const requireUserHasAStripeAccountOrInitalizeOne = require('../middleware/requireUserHasAStripeAccountOrInitalizeOne');

// const { paymentDataAccess } = require('../data-access/paymentDataAccess');
const { jobDataAccess } = require('../data-access/jobDataAccess');
const { bidDataAccess } = require('../data-access/bidDataAccess');

const { getChargeDistributionDetails } = require('../utils/chargesCalculatorUtil');

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedJobOwnerBidderAndRelevantNotificationDetails;

const keys = require('../config/keys');

module.exports = (app) => {
  app.post(
    ROUTES.API.PAYMENT.POST.payment,
    requireLogin,
    requireJobOwner,
    requireJobIsNotAwarded,
    requireNoPaymentProcessedForThisJobBefore,
    // requiresCheckPayBidderDetails,
    async (req, res, next) => {
      try {
        const mongoUser_id = req.user._id.toString();

        const { jobId, bidId } = req.body.data;

        const theBid = await bidDataAccess.getBidById(bidId);
        const theJob = await jobDataAccess.getJobWithOwnerDetails(jobId);

        if (!theBid || !theBid._id || !theJob || !theJob._id) {
          return res.status(403).send({
            errorMsg:
              "Couldn't locate the job and corresponding Bid. Your card was NOT charged, reload the page and try again.",
          });
        }

        const { _bidderRef, bidAmount } = theBid;
        const {
          email: bidderEmailObject,
          _id: bidderIdObject,
          userId: bidderUserId,
          displayName: bidderDisplayName,
        } = _bidderRef;
        const bidderEmail = bidderEmailObject.emailAddress;
        const bidderId = bidderIdObject.toString();

        const requesterEmail = theJob._ownerRef.email.emailAddress;
        const requesterId = theJob._ownerRef._id.toString();
        const requesterCustomerId = theJob._ownerRef.stripeCustomerAccId;
        const taskImages =
          theJob.taskImages && theJob.taskImages.length > 0
            ? theJob.taskImages.map((image) => image.url)
            : [];

        // confirm award and pay
        const { requesterTotalPayment, bidOrBooPlatformFee } = getChargeDistributionDetails(
          bidAmount.value
        );

        let stripeAccDetails = await userDataAccess.getUserStripeAccount(bidderId);

        if (!stripeAccDetails.accId) {
          // user does not have a stripe account , we must establish one
          const newStripeConnectAcc = await stripeServiceUtil.initializeConnectedAccount({
            _id: bidderId,
            userId: bidderUserId,
            displayName: bidderDisplayName,
            email: bidderEmail,
          });
          if (newStripeConnectAcc.id) {
            const updateUser = await userDataAccess.findByUserIdAndUpdate(bidderUserId, {
              stripeConnect: {
                accId: newStripeConnectAcc.id,
              },
            });
            stripeAccDetails = updateUser.stripeConnect;
          } else {
            return res.status(400).send({
              errorMsg:
                'The bidder does not have a stripe account with us. Sorry we can not process your payment for this bidder',
            });
          }
        }

        if (stripeAccDetails.accId) {
          console.log('BIDORBOOLOGGING - PAYMENT - process charge');
          const { id: sessionClientId } = await stripeServiceUtil.createChargeForSessionId({
            taskImages,
            metadata: {
              bidderId,
              bidderEmail,
              proposerId: req.user._id.toString(),
              requesterEmail,
              jobId,
              bidId,
              note: `Requester Paid for ${theJob.jobTitle || theJob.templateId}`,
            },
            bidderDisplayName: bidderDisplayName || bidderEmail,
            taskId: jobId,
            taskName: theJob.jobTitle,
            requesterEmail,
            totalCharge: requesterTotalPayment,
            bidOrBooServiceFee: bidOrBooPlatformFee,
            requesterId,
            taskerAccId: stripeAccDetails.accId,
            requesterCustomerId,
          });

          await jobDataAccess.updateLatestCheckoutSession(jobId, mongoUser_id, sessionClientId);

          return res.status(200).send({ sessionClientId });
        }
      } catch (e) {
        e.safeMsg = "We couldn't confirm the charge details. NO charge was applied to your card";
        next(e);
      }
    }
  );

  // app.get(ROUTES.API.PAYMENT.GET.payment, requireLogin, async (req, res) => {
  //   try {
  //     const paymentsDetails = await paymentDataAccess.getAllPaymentsDetails();

  //     res.send({ paymentsDetails });
  //   } catch (e) {
  //     return res.status(400).send({ errorMsg: 'Failed To create charge', details: `${e}` });
  //   }
  // });

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
        await stripeServiceUtil.updateStripeConnectedAccountDetails(
          stripeConnectAccId,
          connectedAccountDetails
        );
        if (last4BankAcc) {
          const updatedUser = await userDataAccess.updateUserProfileDetails(userId, {
            'stripeConnect.last4BankAcc': last4BankAcc,
          });
        }
        return res.send({ success: true, updatedUser: updatedUser });
      } catch (e) {
        return res.status(400).send({ errorMsg: e });
      }
    }
  );

  app.get(
    ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification,
    requireBidorBooHost,
    requireLogin,
    requireUserHasAStripeAccountOrInitalizeOne,
    async (req, res) => {
      try {
        if (!req.query || !req.query.redirectUrl) {
          return res.status(403).send({
            errorMsg: 'invalid url params',
          });
        }

        const { stripeConnectAccId } = res.locals.bidOrBoo;
        const { url } = await stripeServiceUtil.getCustomAccountLink({
          stripeConnectAccId,
          redirectUrl: req.query.redirectUrl,
          isNewCustomer: true,
          collectMinimum: true,
        });

        return res.send({ success: true, accountLinkUrl: url });
      } catch (e) {
        return res.status(400).send({ errorMsg: e });
      }
    }
  );

  app.get(
    ROUTES.API.PAYMENT.GET.accountLinkForUpdatingVerification,
    requireBidorBooHost,
    requireLogin,
    requireUserHasAStripeAccountOrInitalizeOne,
    async (req, res) => {
      try {
        if (!req.query || !req.query.redirectUrl) {
          return res.status(403).send({
            errorMsg: 'invalid url params',
          });
        }

        const { stripeConnectAccId } = res.locals.bidOrBoo;
        const { url } = await stripeServiceUtil.getCustomAccountLink({
          stripeConnectAccId,
          redirectUrl: req.query.redirectUrl,
          isNewCustomer: false,
          collectMinimum: false,
        });

        return res.send({ success: true, accountLinkUrl: url });
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
  // /**
  //  * user verification
  //  * verification issues with image
  //  * https://stripe.com/docs/connect/payouts#using-manual-payouts
  //  */
  // //xxxx
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
                'payoutDetails.status': { status, id },
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
                'payoutDetails.status': { status, id },
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

  app.post(ROUTES.API.PAYMENT.POST.chargeSucceededWebhook, async (req, res, next) => {
    try {
      console.log('chargesucceeded is triggered');

      // sign key by strip
      let endpointSecret = keys.stripeWebhookChargesSig;
      let sig = req.headers['stripe-signature'];
      let event = stripeServiceUtil.validateSignature(req.body, sig, endpointSecret);
      if (event) {
        const {
          data: { object: chargeObject },
        } = event;

        const {
          id: chargeId,
          captured,
          paid,
          application_fee_amount: applicationFeeAmount,
          amount,
          payment_intent: paymentIntentId,
          payment_method: paymentMethodId,
          destination: destinationStripeAcc,
          metadata: { bidId, jobId },
        } = chargeObject;

        if (!captured || !paid) {
          return res.status(400).send('charge not captured');
        }

        console.log('BIDORBOOLOGGING - PAYMENT - process charge');

        const theJob = await jobDataAccess.getJobById(jobId);

        if (theJob && theJob.processedPayment && theJob.processedPayment.chargeId) {
          // we already reported this , dont do anything
          return res.status(200).send();
        }
        // console.log('-------BidOrBooLogging----------------------');
        // console.log('BidOrBooPayment - charge Succeeded');
        // console.log('-------BidOrBooLogging----------------------');
        // update the job and bidder with the chosen awarded bid
        await jobDataAccess.updateJobWithAwardedBidAndPaymentDetails(jobId, bidId, {
          amount,
          chargeId,
          applicationFeeAmount,
          destinationStripeAcc,
          paymentIntentId,
          paymentMethodId,
        });
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
        } = await getAllContactDetails(jobId);
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
      }
      return res.status(200).send();
    } catch (e) {
      return res.status(400).send({ errorMsg: 'chargesucceeded failured', details: `${e}` });
    }
  });

  app.post(ROUTES.API.PAYMENT.POST.checkoutFulfillment, async (req, res, next) => {
    try {
      return res.status(200).send();
      // console.log('payoutsWebhook is triggered');

      // // sign key by strip
      // let endpointSecret = keys.stripeWebhookSessionSig;
      // let sig = req.headers['stripe-signature'];
      // let event = stripeServiceUtil.validateSignature(req.body, sig, endpointSecret);

      // if (event) {
      //   const { type } = event;

      //   // update customer card with card in this
      //   // update address
      //   if (type === 'checkout.session.completed') {
      //     const session = event.data.object;
      //     const { payment_intent } = session;
      //     const paymentIntentDetails = await stripeServiceUtil.getPaymentIntents(payment_intent);
      //     const { metadata, id } = paymentIntentDetails;

      //     const { jobId, bidId, amount } = metadata;

      //     const updateJobAndBid = await jobDataAccess.updateJobAwardedBid(jobId, bidId, {
      //       paymentIntentId: id,
      //       amount,
      //     });

      //     return res.status(200).send();
      //   }
      // }
      // return res.status(400).send({
      //   safeMsg: 'something went wrong handling payment, our crew wil be in touch with you',
      // });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'payoutsWebhook failured', details: `${e}` });
    }
  });
};
