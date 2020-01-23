// https://github.com/gladchinda/joi-schema-validation-sourcecode/blob/master/schemas.js

// load Joi module
const { Joi } = require('celebrate');

const MAX_PARAGRAPH_LENGTH = 255;
const MAX_NAME_LENGTH = 25;
const MIN_NAME_LENGTH = 3;

exports.notificationSettingsUpdateReq = {
  body: Joi.object({
    data: Joi.object({
      push: Joi.bool()
        .strict()
        .error(() => {
          return {
            message: 'Push notification settings was not updated',
          };
        })
        .required(),
      email: Joi.bool()
        .strict()
        .error(() => {
          return {
            message: 'Email notification settings was not updated',
          };
        })
        .required(),
      text: Joi.bool()
        .strict()
        .error(() => {
          return {
            message: 'Text messaging notification settings was not updated',
          };
        })
        .required(),
      newPostedTasks: Joi.bool()
        .strict()
        .error(() => {
          return {
            message: 'New Posted Tasks notification settings was not updated',
          };
        })
        .required(),
    }),
  }),
};

exports.agreeToTosReq = {
  body: Joi.object({
    data: Joi.object({
      agreedToTOS: Joi.bool()
        .strict()
        .error(() => {
          return {
            message: 'User must agree to terms of service',
          };
        })
        .required(),
    }),
  }),
};

// exports.tasksICanDoReq = {
//   body: Joi.object({
//     data: Joi.object({
//       tasksICanDo: Joi.array()
//         .items(
//           Joi.string()
//             .trim()
//             .valid(['bdbHouseCleaning', 'bdbCarDetailing', 'bdbPetSittingWalking','bdbMoving'])
//         )
//         .error(() => {
//           return {
//             message: 'Tasks I can do settings was not updated',
//           };
//         })
//         .required(),
//     }),
//   }),
// };
exports.loggedoutEmailVerificationReq = {
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
              '"email address" must be a valid email and (5-100) characters long for example bidorboo@bidorboo.ca',
          };
        })
        .required(),
    }),
  }),
};
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
              '"email address" must be a valid email and (5-100) characters long for example bidorboo@bidorboo.ca',
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

exports.verifyViaCode = {
  body: Joi.object({
    data: Joi.object({
      code: Joi.number()
        .integer()
        .positive()
        .error(() => {
          return {
            message: '"verification code" must be valid code',
          };
        })
        .required(),
    }),
  }),
};
exports.verifyPhoneViaCode = {
  body: Joi.object({
    data: Joi.object({
      code: Joi.string()
        .trim()
        .min(6)
        .error(() => {
          return {
            message: '"verification code" must be valid code',
          };
        })
        .required(),
    }),
  }),
};

exports.updateAppViewReq = {
  body: Joi.object({
    data: Joi.object({
      appViewId: Joi.string()
        .trim()
        .uppercase()
        .valid(['REQUESTER', 'TASKER'])
        .error(() => {
          return {
            message: 'Invalid App view',
          };
        })
        .required(),
    }),
  }),
};

exports.otherUserProfileInfo = {
  query: Joi.object({
    otherUserId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, could not get user profile info',
        };
      })
      .required(),
  }),
};

exports.userDetailsReqSchema = {
  body: Joi.object({
    data: Joi.object({
      displayName: Joi.string()
        .trim()
        .min(MIN_NAME_LENGTH)
        .max(MAX_NAME_LENGTH)
        .error(() => {
          return {
            message: '[display name field] must be alphanumeric and (5-30) characters long',
          };
        }),
      personalParagraph: Joi.string()
        .valid('')
        .optional()
        .max(MAX_PARAGRAPH_LENGTH)
        .error(() => {
          return {
            message:
              '[personal paragraph field] must be valid alphanumeric and less than 255 characters long',
          };
        }),
      phone: Joi.object({
        phoneNumber: Joi.string()
          .trim()
          .regex(
            /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/
          )
          .required()
          .error(() => {
            return {
              message: '[phone number field] must be a valid format for example (613) 333-4444',
            };
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
                '[email address field] must be a valid email and (5-100) characters long for example bidorboo@bidorboo.ca',
            };
          }),
      }),
    }).required(),
  }),
};
