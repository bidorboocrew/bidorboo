const Joi = require('@hapi/joi');

userDetailsReqSchema = Joi.object().keys({
  displayName: Joi.string()
    .trim()
    .min(5)
    .max(30),
  personalParagraph: Joi.string()
    .trim()
    .min(5)
    .max(500),
  email: Joi.object().keys({
    emailAddress: Joi.string()
      .trim()
      .min(5)
      .max(500),
  }),
  phone: Joi.object().keys({
    phoneNumber: Joi.string()
      .trim()
      .regex(/^\d{10}$/)
      .required()
      .error(
        (errors) =>
          new Error(
            'invalid phone number , must follow areacode 3 digits followed by phone number 7 digits for example 9051234444'
          )
      ),
  }),
  picId: Joi.object().keys({
    front: Joi.string().trim(),
    back: Joi.string().trim(),
  }),
});
