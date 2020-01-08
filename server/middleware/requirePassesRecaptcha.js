// emailing services
const keys = require('../config/keys');
const Recaptcha = require('recaptcha-verify');
// skip

const recaptcha = new Recaptcha({
  secret: keys.recaptchaApiKey,
});

module.exports = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    const recpatchaAssesmentResponse = (error, response) => {
      if (error) {
        console.log('BIDORBOOLOGS - ERROR - RECAPTCHA + error : ' + error);

        return res.status(400).send({ safeMsg: 'Failed To evaluate recaptcha ' });
      }
      if (response.success) {
        next();
      } else {
        return res.status(401).send({
          safeMsg:
            'For security reasons we can not process your response. RECAPTCHA had assessed this as a Bot Like Request. refresh the page before trying again',
        });
      }
    };
    await recaptcha.checkResponse(req.body.recaptchaField, recpatchaAssesmentResponse);
  } catch (e) {
    e.safeMsg = 'Failed To evaluate recaptcha from server';
    return next(e);
  }
};
