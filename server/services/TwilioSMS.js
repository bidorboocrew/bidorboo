// emailing services
const keys = require('../config/keys');
const twilio = require('twilio');

const client = new twilio(keys.twilioAccountSid, keys.twilioAuthToken);

exports.TxtMsgingService = {
  sendRequestAwaitingRequesterConfirmCompletionText: (
    mobileNumber,
    requestTitle,
    urlLink,
    callback = () => {}
  ) => {
    const msgContent = `BidOrBoo: ${requestTitle} awaiting your confirmation! ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendRequestIsCancelledText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} was cancelled! ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendYouAreAwardedRequest: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is awarded to you! ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendRequestIsHappeningSoonText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is happening soon! ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendPhoneVerificationText: (mobileNumber, phoneVerificationCode, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${phoneVerificationCode} is your phone verification code.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendRequestIsCompletedText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is Completed! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } to Rate it.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  tellRequesterToConfirmRequest: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: Please Confirm that ${requestTitle} is Completed! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } to confirm and Rate your Tasker.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  tellRequesterThatWeMarkedRequestDone: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo Marked ${requestTitle} as Complete because you did not act in 3 days. go to ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } to Rate your Tasker.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendRequestIsAwardedText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: Your Bid Won and ${requestTitle} is Assigned to you! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.ca'
    } to View it.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendText: async (mobileNumber, msgContent, callback = () => {}) => {
    client.messages
      .create({
        body: `${msgContent}`,
        to: `+1${mobileNumber}`, // Text this number
        messagingServiceSid: keys.twilioMsgingServiceSid,
        // from: '+16137022661', // From a valid Twilio number
      })
      .then((message) => {
        console.log(`BIDORBOOLOGS======== twilio send msg succeeded ${message.sid}`);
      })
      .catch((e) => {
        console.log(`BIDORBOOLOGS======== twilio send msg issue ${e}`);
      });
  },

  verifyPhone: async (mobileNumber, callback = () => {}) => {
    // https://www.twilio.com/docs/verify/api/verification#start-new-verification
    try {
      await client.verify
        .services(keys.twilioVerificationServiceSid)
        .verifications.create({ to: `+1${mobileNumber}`, channel: 'sms' });
    } catch (e) {
      console.log(`BIDORBOOLOGS======== twilio send verifyPhone issue ${e}`);
    }
  },
  verifyPhoneCode: async (mobileNumber, code, callback = () => {}) => {
    // https://www.twilio.com/docs/verify/api/verification#start-new-verification
    try {
      const resp = await client.verify
        .services(keys.twilioVerificationServiceSid)
        .verificationChecks.create({ code, to: `+1${mobileNumber}` });
      return resp;
    } catch (e) {
      console.log(`BIDORBOOLOGS======== twilio send verifyPhoneCode issue ${e}`);
    }
  },
};
