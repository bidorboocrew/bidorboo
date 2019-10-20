// https://github.com/gladchinda/joi-schema-validation-sourcecode/blob/master/schemas.js

// load Joi module
const { Joi } = require('celebrate');

const MAX_PARAGRAPH_LENGTH = 255;
const MAX_NAME_LENGTH = 25;
const MIN_NAME_LENGTH = 3;

exports.resetPasswordReqSchema = {
  body: Joi.object({
    data: Joi.object({
      emailAddress: Joi.string()
        .trim()
        .email()
        .min(MIN_NAME_LENGTH)
        .max(MAX_PARAGRAPH_LENGTH)
        .error(() => {
          return {
            message:
              '"email address" must be a valid email and (5-100) charachters long for example bidorboocrew@bidorboocrew.com',
          };
        })
        .required(),
      verificationCode: Joi.number()
        .integer()
        .positive()
        .error(() => {
          return {
            message: '"verification code" must be valid code',
          };
        })
        .required(),
      password1: Joi.string()
        .trim()
        .min(6)
        .max(100)
        .error(() => {
          return {
            message: '"password" must be valid 6-100 chars long',
          };
        })
        .required(),
      password2: Joi.string()
        .trim()
        .min(6)
        .max(100)
        .error(() => {
          return {
            message: '"confirmation password" must match and be valid 6-100 chars long',
          };
        })
        .required()
        .valid(Joi.ref('password1')),
    }),
  }),
};

exports.userDetailsReqSchema = Joi.object({
  data: Joi.object({
    displayName: Joi.string()
      .trim()
      .min(MIN_NAME_LENGTH)
      .max(MAX_NAME_LENGTH)
      .error(() => {
        return {
          message: '"display name" must be alphanumeric and (5-30) charachters long',
        };
      }),

    personalParagraph: Joi.string()
      .trim()
      .min(MIN_NAME_LENGTH)
      .max(MAX_PARAGRAPH_LENGTH)
      .error(() => {
        return {
          message: '"personal paragraph" must be valid alphanumeric and (5-500) charachters long',
        };
      }),
    phone: Joi.object({
      phoneNumber: Joi.string()
        .trim()
        .regex(/^\d{10}$/)
        .required()
        .error(() => {
          return { message: '"phone number" must be a valid format for example 9053334444' };
        }),
    }),
    picId: Joi.object({
      front: Joi.string().trim(),
      back: Joi.string().trim(),
    }),
    email: Joi.object({
      emailAddress: Joi.string()
        .trim()
        .min(MIN_NAME_LENGTH)
        .max(MAX_PARAGRAPH_LENGTH)
        .required()
        .error(() => {
          return {
            message:
              '"email address" must be a valid email and (5-100) charachters long for example bidorboocrew@bidorboocrew.com',
          };
        }),
    }),
  }).required(),
});
