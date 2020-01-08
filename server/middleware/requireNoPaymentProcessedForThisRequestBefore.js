const { requestDataAccess } = require('../data-access/requestDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedRequestOwnerTaskerAndRelevantNotificationDetails;

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { requestId } = req.body.data;
    if (!requestId) {
      return res.status(403).send({
        safeMsg: 'missing paramerters. can not confirm that you are the request owner.',
      });
    }

    const theRequest = await requestDataAccess.getRequestById(requestId);
    if (theRequest && theRequest._id) {
      if (theRequest.latestCheckoutSession) {
        const { payment_intent } = await stripeServiceUtil.retrieveSession(
          theRequest.latestCheckoutSession
        );
        const pi = await stripeServiceUtil.getPaymentIntents(payment_intent);
        if (
          pi.status &&
          pi.status === 'succeeded' &&
          pi.charges &&
          pi.charges.data &&
          pi.charges.data[0]
        ) {
          const chargeObject = pi.charges.data[0];

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

          if (captured && paid) {
            // console.log('-------BidOrBooLogging----------------------');
            // console.log('BidOrBooPayment - charge Succeeded');
            // console.log('-------BidOrBooLogging----------------------');
            // update the request and tasker with the chosen awarded bid
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

          return res.status(400).send({
            safeMsg:
              'You have already awarded and made a payment to book this service, please refresh the page to see the latest state.',
          });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      return res.status(403).send({ safeMsg: 'could not locate this request.' });
    }
  } catch (e) {
    e.safeMsg =
      'failed to validate if there is a payment already for this request, use the chat button at the bottom of the screen to reachout to our customer support team';
    return next(e);
  }
};
