// emailing services
const keys = require('../config/keys');
const twilio = require('twilio');

const client = new twilio(keys.twilioAccountSid, keys.twilioAuthToken);

exports.TxtMsgingService = {
  sendJobAwaitingRequesterConfirmCompletionText: (
    mobileNumber,
    requestTitle,
    urlLink,
    callback = () => {}
  ) => {
    const msgContent = `BIDORBOO: ${requestTitle} awaiting your confirmation! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendJobIsCancelledText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO: ${requestTitle} was cancelled! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendYouAreAwardedJob: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO: ${requestTitle} is awarded to you! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendJobIsHappeningSoonText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO: ${requestTitle} is happening soon! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendPhoneVerificationText: (mobileNumber, phoneVerificationCode, callback = () => {}) => {
    const msgContent = `BIDORBOO: ${phoneVerificationCode} is your phone verification code.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendJobIsCompletedText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO: ${requestTitle} is Completed! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } to Rate it.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  tellRequesterToConfirmJob: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO: Please Confirm that ${requestTitle} is Completed! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } to confirm and Rate your Tasker.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  tellRequesterThatWeMarkedJobDone: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO Marked ${requestTitle} as Complete because you did not act in 3 days. go to ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } to Rate your Tasker.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendJobIsAwardedText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BIDORBOO: Your Bid Won and ${requestTitle} is Assigned to you! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
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
