// emailing services
const keys = require('../config/keys');
const twilio = require('twilio');
const ROUTES = require('../backend-route-constants');

const client = new twilio(keys.twilioAccountSid, keys.twilioAuthToken);

exports.TxtMsgingService = {
  sendJobAwaitingRequesterConfirmCompletionText: (
    mobileNumber,
    requestTitle,
    urlLink,
    callback = () => {}
  ) => {
    const msgContent = `BidOrBoo: ${requestTitle} awaiting your confirmation! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendJobIsCancelledText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} was cancelled! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendYouAreAwardedJob: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is awarded to you! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendJobIsHappeningSoonText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is happening soon! ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } for details`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },
  sendPhoneVerificationText: (mobileNumber, phoneVerificationCode, callback = () => {}) => {
    const msgContent = `BidOrBoo: click to verify your phone ${ROUTES.CLIENT.dynamicVerification(
      'Phone',
      phoneVerificationCode
    )}`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendJobIsCompletedText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is Completed! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } to Rate it.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendJobIsAwardedText: (mobileNumber, requestTitle, urlLink, callback = () => {}) => {
    const msgContent = `BidOrBoo: Your Bid Won and ${requestTitle} is Assigned to you! go to ${
      urlLink ? urlLink : 'https://www.bidorboo.com'
    } to View it.`;
    return this.TxtMsgingService.sendText(mobileNumber, msgContent, callback);
  },

  sendText: async (mobileNumber, msgContent, callback = () => {}) => {
    // let formattedMobileNumber = `1-${mobileNumber}`;

    // if (mobileNumber && mobileNumber.length > 0) {
    //   formattedMobileNumber = formattedMobileNumber.replace(/-/g, '');
    //   formattedMobileNumber = `+${formattedMobileNumber}`;
    // }

    client.messages
      .create({
        body: `${msgContent}`,
        to: `+1${mobileNumber}`, // Text this number
        from: keys.twilioMsgingServiceSid,
        // from: '+16137022661', // From a valid Twilio number
      })
      .then((message) => {
        console.log(message.sid);
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
