// emailing services
const keys = require('../config/keys');
const twilio = require('twilio');

const client = new twilio(keys.twilioAccountSid, keys.twilioAuthToken);

exports.TxtMsgingService = {
  sendJobIsCancelledText: (mobileNumber, requestTitle, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} was cancelled! https://www.bidorboo.com for details`;
    return sendText(mobileNumber, msgContent, callback);
  },
  sendYouAreAwardedJob: (mobileNumber, requestTitle, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is awarded to you! https://www.bidorboo.com for details`;
    return sendText(mobileNumber, msgContent, callback);
  },
  sendJobIsHappeningSoonText: (mobileNumber, requestTitle, callback = () => {}) => {
    const msgContent = `BidOrBoo: ${requestTitle} is happening soon! https://www.bidorboo.com for details`;
    return sendText(mobileNumber, msgContent, callback);
  },
  sendText: (mobileNumber, msgContent, callback = () => {}) => {
    // let formattedMobileNumber = `1-${mobileNumber}`;

    // if (mobileNumber && mobileNumber.length > 0) {
    //   formattedMobileNumber = formattedMobileNumber.replace(/-/g, '');
    //   formattedMobileNumber = `+${formattedMobileNumber}`;
    // }
    // request.post(
    //   {
    //     headers: {
    //       'content-type': 'application/x-www-form-urlencoded',
    //       Accepts: 'application/json',
    //     },
    //     url: keys.blowerText + '/messages',
    //     form: {
    //       to: formattedMobileNumber,
    //       message: `${msgContent}`,
    //     },
    //   },
    //   (error, response, body) => {
    //     if (!error && response.statusCode == 201) {
    //       console.log('Message sent!');
    //     } else {
    //       const apiResult = JSON.parse(body);
    //       console.log('Error was: ' + apiResult.message);
    //     }
    //     callback(error, response, body);
    //   }
    // );

    client.messages
      .create({
        body: `${msgContent}`,
        to: '+16138677243', // Text this number
        from: '+16137022661', // From a valid Twilio number
      })
      .then((message) => {
        debugger;
        console.log(message.sid);
      })
      .catch((e) => {
        debugger;
        console.log(e);
      });
  },
};
