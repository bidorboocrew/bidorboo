// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const upcomingJob = require('./sendGrid-template-upcomingJob').upcomingJob;
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
      html: upcomingJob({
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
};
