// emailing services
const keys = require('../config/keys');
const sg = require('sendgrid')(keys.sendGridKey);
const helper = require('sendgrid').mail;

exports.EmailService = {
  sendEmail: (from, to, subject, contentText, callback) => {

    var from_email = new helper.Email(from);
    var to_email = new helper.Email(to);
    var subject = subject;
    var content = new helper.Content('text/plain', contentText);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    // function(error, response) {
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    // }
    sg.API(request, callback);
  },
};
