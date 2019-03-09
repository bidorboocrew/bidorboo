// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
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
};
