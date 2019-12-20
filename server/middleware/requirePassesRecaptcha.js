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
        return res
          .status(400)
          .send({ errorMsg: 'Failed To evaluate recaptcha ', details: `${error}` });
      }
      if (response.success) {
        next();
      } else {
        return res.status(401).send({
          errorMsg:
            'For security reasons we can not process your response. RECAPTCHA had assessed this as a Bot Like Request. refresh the page before trying again',
        });
      }
    };
    await recaptcha.checkResponse(req.body.recaptchaField, recpatchaAssesmentResponse);
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'Failed To evaluate recaptcha from server ', details: `${e}` });
  }
};
