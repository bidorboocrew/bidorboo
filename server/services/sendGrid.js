// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
const populateNewBidHtmlTemplate = require('./sendGrid-Htmltemplate-newBid').populateHtmlTemplate;

sgMail.setApiKey(keys.sendGridKey);

exports.EmailService = {
  sendEmail: ({
    from = 'bidorboocrew@gmail.com',
    to,
    subject,
    contentText,
    toDisplayName,
    contentHtml,
    clickLink,
    clickDisplayName,
    callback,
  }) => {
    const msg = {
      to,
      from,
      subject,
      text: contentText,
      html: populateHtmlTemplate({
        toDisplayName: to || toDisplayName,
        contentHtml,
        clickLink,
        clickDisplayName,
      }),
    };
    // function(error, response) {
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    // }
    sgMail.send(msg);
  },
  sendNewBidRecievedEmail: ({
    to,
    toDisplayName,
    taskName,
    clickLink,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `Your ${taskName} request has recieved a new bid`,
      text: `Exciting news! Your ${taskName} request has recieved a new bid. Check the bids and award a Tasker when the price is right`,
      html: populateNewBidHtmlTemplate({
        toDisplayName: to || toDisplayName,
        contentHtml: `${taskName}`,
        clickLink,
        clickDisplayName: 'View The Bid',
      }),
    };
    // function(error, response) {
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    // }
    sgMail.send(msg);
  },
};
