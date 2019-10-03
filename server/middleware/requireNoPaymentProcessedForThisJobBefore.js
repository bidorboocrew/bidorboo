const { jobDataAccess } = require('../data-access/jobDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

const sendGridEmailing = require('../services/sendGrid').EmailService;
const sendTextService = require('../services/TwilioSMS').TxtMsgingService;
const WebPushNotifications = require('../services/WebPushNotifications').WebPushNotifications;

const getAllContactDetails = require('../utils/commonDataUtils')
  .getAwardedJobOwnerBidderAndRelevantNotificationDetails;

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { jobId } = req.body.data;
    if (!jobId) {
      return res.status(403).send({
        errorMsg: 'missing paramerters jobId . can not confirm that you are the Job Owner.',
      });
    }

    const theJob = await jobDataAccess.getJobById(jobId);
    if (theJob && theJob._id) {
      if (theJob.latestCheckoutSession) {
        const { payment_intent } = await stripeServiceUtil.retrieveSession(
          theJob.latestCheckoutSession
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
            metadata: { bidId, jobId },
          } = chargeObject;

          if (captured && paid) {
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

          return res.status(400).send({
            errorMsg:
              'You have already awarded and made a payment to book this service, please refresh the page to see the latest state.',
          });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      return res.status(403).send({ errorMsg: 'could not locate this job.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg:
        'failed to validate if there is a payment already for this job, use the chat button at the bottom of the screen to reachout to our customer support team',
      details: `${e}`,
    });
  }
};

