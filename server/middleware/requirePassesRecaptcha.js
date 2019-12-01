// // emailing services
// const keys = require('../config/keys');
// const Recaptcha = require('recaptcha-verify');
// // skip

// const recaptcha = new Recaptcha({
//   secret: keys.recaptchaApiKey,
//   verbose: true,
// });

// module.exports = async (req, res, next) => {
//   if (!req.body || !req.body.recaptchaField) {
//     return res.status(403).send({
//       errorMsg:
//         'missing paramerters recaptchaField. can not confirm that you are not a robot. if this persists please contact bidorboo@bidorboo.ca',
//     });
//   }
//   try {
//     const recpatchaAssesmentResponse = (error, response) => {
//       if (error) {
//         return res
//           .status(400)
//           .send({ errorMsg: 'Failed To evaluate recaptcha ', details: `${error}` });
//       }
//       if (response.success) {
//         next();
//       } else {
//         return res.status(401).send({
//           errorMsg:
//             'For security reasons we can not process your response. RECAPTCHA had assessed this as a Bot Like Request. refresh the page before trying again',
//         });
//       }
//     };
//     await recaptcha.checkResponse(req.body.recaptchaField, recpatchaAssesmentResponse);
//   } catch (e) {
//     return res
//       .status(400)
//       .send({ errorMsg: 'Failed To evaluate recaptcha from server ', details: `${e}` });
//   }
// };
