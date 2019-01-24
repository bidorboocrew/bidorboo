// emailing services
// const sendGridEmailing = require('../services/sendGrid').EmailService;
const keys = require('../config/keys');
var request = require('request');

exports.TxtMsgingService = {
  sendText: (mobileNumber, msgContent, callback = () => {}) => {
    let formattedMobileNumber = `1-${mobileNumber}`;

    if (mobileNumber && mobileNumber.length > 0) {
      formattedMobileNumber = formattedMobileNumber.replace(/-/g, '');
      formattedMobileNumber = `+${formattedMobileNumber}`;
    }
    request.post(
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Accepts: 'application/json',
        },
        url: keys.blowerText + '/messages',
        form: {
          to: formattedMobileNumber,
          message: `${msgContent}`,
        },
      },
      (error, response, body) => {
        if (!error && response.statusCode == 201) {
          console.log('Message sent!');
        } else {
          const apiResult = JSON.parse(body);
          console.log('Error was: ' + apiResult.message);
        }
        callback(error, response, body);
      }
    );
  },
};
