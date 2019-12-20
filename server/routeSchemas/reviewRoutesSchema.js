// https://github.com/gladchinda/joi-schema-validation-sourcecode/blob/master/schemas.js

// load Joi module
const { Joi } = require('celebrate');

exports.submitReviewValidation = {
  body: Joi.object({
    data: Joi.object({
      requestId: Joi.string()
        .trim()
        .error(() => {
          return {
            message: 'Invalid Request, missing request Id',
          };
        })
        .required(),
      qualityOfWorkRating: Joi.number()
        .integer()
        .positive()
        .min(0)
        .max(5)
        .error(() => {
          return {
            message: 'Invalid Request, qow rating must be between [0-5]',
          };
        })
        .required(),
      punctualityRating: Joi.number()
        .integer()
        .positive()
        .min(0)
        .max(5)
        .error(() => {
          return {
            message: 'Invalid Request, p rating must be between [0-5]',
          };
        })
        .required(),
      communicationRating: Joi.number()
        .integer()
        .positive()
        .min(0)
        .max(5)
        .error(() => {
          return {
            message: 'Invalid Request, c rating must be between [0-5]',
          };
        })
        .required(),
      mannerRating: Joi.number()
        .integer()
        .positive()
        .min(0)
        .max(5)
        .error(() => {
          return {
            message: 'Invalid Request, m rating must be between [0-5]',
          };
        })
        .required(),
      personalComment: Joi.string()
        .min(10)
        .max(500)
        .trim()
        .error(() => {
          return {
            message: 'Invalid Request, personal comment is invalid',
          };
        })
        .required(),
    }),
  }),
};
