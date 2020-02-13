const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const { bugsnagClient } = require('../utils/utilities');
const requireRequestOwner = require('../middleware/requireRequestOwner');
const requireNoPaymentProcessedForThisRequestBefore = require('../middleware/requireNoPaymentProcessedForThisRequestBefore');
const requireRequesterHaveStripeCustomerAccountIdOrInitialize = require('../middleware/requireRequesterHaveStripeCustomerAccountIdOrInitialize');
const requireRequestIsNotAwarded = require('../middleware/requireRequestIsNotAwarded');
const userDataAccess = require('../data-access/userDataAccess');

const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const stripeServiceUtil = require('../services/stripeService').util;
const requireUserHasAStripeAccountOrInitalizeOne = require('../middleware/requireUserHasAStripeAccountOrInitalizeOne');

// const { paymentDataAccess } = require('../data-access/paymentDataAccess');
const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bidDataAccess } = require('../data-access/bidDataAccess');

const { getChargeDistributionDetails } = require('../utils/chargesCalculatorUtil');

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedRequestOwnerTaskerAndRelevantNotificationDetails;

const keys = require('../config/keys');

module.exports = (app) => {
  app.post(
    ROUTES.API.PAYMENT.POST.payment,
    requireLogin,
    requireRequestOwner,
    requireRequestIsNotAwarded,
    requireNoPaymentProcessedForThisRequestBefore,
    requireRequesterHaveStripeCustomerAccountIdOrInitialize,
    async (req, res, next) => {
      try {
        const mongoUser_id = req.user._id.toString();

        const { requestId, bidId } = req.body.data;

        const theBid = await bidDataAccess.getBidByIdWithTaskerDetails(bidId, true);
        const theRequest = await requestDataAccess.getRequestWithOwnerDetails(requestId);

        if (!theBid || !theBid._id || !theRequest || !theRequest._id) {
          return res.status(403).send({
            errorMsg:
              "Couldn't locate the request and corresponding Bid. Try again and if this problem persist chat with our customer support.",
          });
        }

        const { _taskerRef, bidAmount } = theBid;
        const {
          email: taskerEmailObject,
          _id: taskerIdObject,
          userId: taskerUserId,
          displayName: taskerDisplayName,
          tos_acceptance,
          canBid,
        } = _taskerRef;

        if (!canBid) {
          return res.status(400).send({
            safeMsg:
              'Sorry, This Tasker is still being verified, You can award someone else instead',
          });
        }
        const taskerEmail = taskerEmailObject.emailAddress;
        const taskerId = taskerIdObject.toString();

        const requesterEmail = theRequest._ownerRef.email.emailAddress;
        const requesterId = theRequest._ownerRef._id.toString();
        const requesterCustomerId = theRequest._ownerRef.stripeCustomerAccId;
        const taskImages =
          theRequest.taskImages && theRequest.taskImages.length > 0
            ? theRequest.taskImages.map((image) => image.url)
            : [];

        // confirm award and pay
        const { requesterPaymentAmount, bidOrBooPlatformFee } = getChargeDistributionDetails(
          bidAmount.value
        );

        let stripeAccDetails = await userDataAccess.getUserStripeAccount(taskerId);

        if (!stripeAccDetails.accId) {
          // user does not have a stripe account , we must establish one
          const newStripeConnectAcc = await stripeServiceUtil.initializeConnectedAccount({
            _id: taskerId,
            userId: taskerUserId,
            displayName: taskerDisplayName,
            email: taskerEmail,
            tosAcceptance: {
              date: tos_acceptance.date,
              ip: tos_acceptance.ip,
            },
          });
          if (newStripeConnectAcc.id) {
            const updateUser = await userDataAccess.findByUserIdAndUpdate(taskerUserId, {
              stripeConnect: {
                accId: newStripeConnectAcc.id,
              },
            });
            stripeAccDetails = updateUser.stripeConnect;
          } else {
            return res.status(400).send({
              safeMsg:
                'This tasker is still under verification steps. In the mean while you can award someone else. Sorry for the inconvenience',
            });
          }
        }

        if (stripeAccDetails.accId) {
          console.log('BIDORBOOLOGGING - PAYMENT - process charge');
          const { id: sessionClientId } = await stripeServiceUtil.createChargeForSessionId({
            taskImages,
            metadata: {
              taskerId,
              taskerEmail,
              requesterId: req.user._id.toString(),
              requesterEmail,
              requestId,
              bidId,
              note: `Requester Paid for Request Type: ${theRequest.requestTemplateDisplayTitle}, Titled: ${theRequest.requestTitle}`,
            },
            taskerDisplayName: taskerDisplayName || taskerEmail,
            taskId: requestId,
            taskName: `Request Type: ${theRequest.requestTemplateDisplayTitle}, Titled: ${theRequest.requestTitle}`,
            requesterEmail,
            totalCharge: requesterPaymentAmount * 100, //in cents
            bidOrBooServiceFee: bidOrBooPlatformFee * 100, //in cents
            requesterId,
            taskerAccId: stripeAccDetails.accId,
            requesterCustomerId,
          });

          await requestDataAccess.updateLatestCheckoutSession(
            requestId,
            mongoUser_id,
            sessionClientId
          );

          return res.status(200).send({ sessionClientId });
        }
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg =
          "Couldn't locate the request and corresponding Bid. Try again and if this problem persist chat with our customer support.";
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.PAYMENT.PUT.setupPaymentDetails,
    requireLogin,
    requireUserHasAStripeAccountOrInitalizeOne,
    async (req, res, next) => {
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
          const userAfterUpdate = await userDataAccess.updateUserProfileDetails(userId, {
            'stripeConnect.last4BankAcc': last4BankAcc,
          });
          return res.send({ success: true, updatedUser: userAfterUpdate });
        }
        return res.status(400).send({
          errorMsg: `couldn't register your bank account. please Chat with our customer support for further help`,
        });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = `couldn't register your bank account please Chat with our customer support for further help`;
        return next(e);
      }
    }
  );

  app.get(
    ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification,
    requireLogin,
    requireUserHasAStripeAccountOrInitalizeOne,
    async (req, res, next) => {
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
        });

        return res.send({ success: true, accountLinkUrl: url });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = `couldn't get account link for setup and verification from stripe`;
        return next(e);
      }
    }
  );

  app.get(
    ROUTES.API.PAYMENT.GET.accountLinkForUpdatingVerification,
    requireLogin,
    requireUserHasAStripeAccountOrInitalizeOne,
    async (req, res, next) => {
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
        });

        return res.send({ success: true, accountLinkUrl: url });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = `couldn't get account link update for setup and verification from stripe`;
        return next(e);
      }
    }
  );

  app.get(ROUTES.API.PAYMENT.GET.myStripeAccountDetails, requireLogin, async (req, res, next) => {
    try {
      const mongoUser_id = req.user._id.toString();
      let accDetails = {};
      let accBalanceDetails = [];
      const userStripeAccountDetail = await userDataAccess.getUserStripeAccount(mongoUser_id);

      if (userStripeAccountDetail && userStripeAccountDetail.accId) {
        accDetails = await stripeServiceUtil.getConnectedAccountDetails(
          userStripeAccountDetail.accId
        );
        if (accDetails) {
          const {
            id: accId,
            payouts_enabled,
            charges_enabled,
            requirements: accRequirements,
            metadata,
            capabilities: { transfers, card_payments },
          } = accDetails;

          const { userId } = metadata;

          await userDataAccess.updateStripeAccountRequirementsDetails({
            userId,
            accId,
            chargesEnabled: charges_enabled,
            payoutsEnabled: payouts_enabled,
            capabilities: {
              card_payments,
              transfers,
            },
            accRequirements,
          });
        }

        accBalanceDetails = await stripeServiceUtil.getConnectedAccountBalance(
          userStripeAccountDetail.accId
        );
      }
      let verifiedAmount = 0;
      let pendingVerificationAmount = 0;
      let paidoutAmount = 0;

      if (accBalanceDetails && accBalanceDetails.length === 2) {
        const accountBalance = accBalanceDetails[0];
        const accountPayouts = accBalanceDetails[1];

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
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To retrieve your connected stripe account details';
      return next(e);
    }
  });
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
              capabilities: { transfers, card_payments },
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
              capabilities: {
                card_payments,
                transfers,
              },
            });

            await userDataAccess.updateStripeAccountRequirementsDetails({
              eventId: id,
              userId,
              accId,
              chargesEnabled: charges_enabled,
              payoutsEnabled: payouts_enabled,
              capabilities: {
                card_payments,
                transfers,
              },
              accRequirements,
            });
            console.log('updateStripeAccountRequirementsDetails done');
            console.log('-------BidOrBooLogging----------------------');
          }
        }
      }
      return res.status(200).send();
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'connected Accounts Webhook failure';
      sendGridEmailing.informBobCrewAboutFailedImportantStuff('connectedAccountsWebhook', {
        safeMsg: 'connected Accounts Webhook failure',
      });
      return next(e);
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
        const { type, data } = event;
        const { status, metadata } = data;
        const { requestId } = metadata;

        switch (type) {
          case 'payout.paid':
            console.log('payoutsWebhook payout.paid');
            console.log({ requestId });

            // update the request about this
            requestDataAccess.updateRequestById(requestId, {
              $set: {
                'payoutDetails.status': { status },
              },
            });
            sendGridEmailing.informBobCrewAboutSuccessPayment({ requestId, paymentDetails: data });

            //xxx inform user that it is paid via msg email..etc
            break;
          case 'payout.failed':
            console.log('payoutsWebhook payout.failed');
            console.log({ requestId });
            requestDataAccess.updateRequestById(requestId, {
              $set: {
                'payoutDetails.status': { status },
              },
            });
            sendGridEmailing.informBobCrewAboutFailedPayment({ requestId, paymentDetails: data });
            break;
          default:
            requestDataAccess.updateRequestById(requestId, {
              $set: {
                'payoutDetails.status': { status },
              },
            });
            sendGridEmailing.informBobCrewAboutFailedPayment({ requestId, paymentDetails: data });
            break;
        }
      }
      return res.status(200).send();
    } catch (e) {
      bugsnagClient.notify(e);

      sendGridEmailing.informBobCrewAboutFailedImportantStuff('payoutsWebhook', {
        safeMsg: 'payout webhook failed',
      });
      e.safeMsg = 'payout webhook failed';
      return next(e);
    }
  });

  app.post(ROUTES.API.PAYMENT.POST.chargeSucceededWebhook, async (req, res, next) => {
    try {
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
          metadata: { bidId, requestId },
        } = chargeObject;

        if (!captured || !paid) {
          return res.status(400).send('charge not captured');
        }

        console.log('BIDORBOOLOGGING - PAYMENT - process charge');

        const theRequest = await requestDataAccess.getRequestById(requestId);

        if (theRequest && theRequest.processedPayment && theRequest.processedPayment.chargeId) {
          return res.status(200).send();
        }

        await requestDataAccess.updateRequestWithAwardedBidAndPaymentDetails(requestId, bidId, {
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
          requestDisplayName,
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
        } = await getAllContactDetails(requestId);
        if (allowedToEmailRequester) {
          sendGridEmailing.tellRequesterThanksforPaymentAndTaskerIsRevealed({
            to: requesterEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: requesterDisplayName,
            linkForOwner: requestLinkForRequester,
          });
        }
        if (allowedToEmailTasker) {
          sendGridEmailing.tellTaskerThatTheyWereAwarded({
            to: taskerEmailAddress,
            requestTitle: requestDisplayName,
            toDisplayName: taskerDisplayName,
            linkForTasker: requestLinkForTasker,
          });
        }
        if (allowedToTextTasker) {
          sendTextService.sendRequestIsAwardedText(
            taskerPhoneNumber,
            requestDisplayName,
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
      bugsnagClient.notify(e);

      sendGridEmailing.informBobCrewAboutFailedImportantStuff('chargeSucceededWebhook', {
        safeMsg: 'charges succeeded failed',
      });
      e.safeMsg = 'charge succeeded failed';
      return next(e);
    }
  });

  app.post(ROUTES.API.PAYMENT.POST.checkoutFulfillment, async (req, res, next) => {
    try {
      // return res.status(200).send();
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
      //     const { requestId, bidId, amount } = metadata;
      //     const updateRequestAndBid = await requestDataAccess.updateRequestAwardedBid(requestId, bidId, {
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
      bugsnagClient.notify(e);

      e.safeMsg = 'checkout Fulfillment failed';
      return next(e);
    }
  });
};
