// https://github.com/gladchinda/joi-schema-validation-sourcecode/blob/master/schemas.js

// load Joi module
const { Joi } = require('celebrate');

exports.deleteOpenBid = {
  body: Joi.object({
    bidId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, can not delete bid',
        };
      })
      .required(),
  }),
};
exports.cancelAwardedBid = {
  body: Joi.object({
    bidId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing bid Id',
        };
      })
      .required(),
  }),
};

exports.openBidDetails = {
  query: Joi.object({
    openBidId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing open bid Id',
        };
      })
      .required(),
  }),
};

exports.awardedBidDetailsForTasker = {
  query: Joi.object({
    awardedBidId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing awarded bid Id',
        };
      })
      .required(),
  }),
};

exports.createNewBid = {
  body: Joi.object({
    recaptchaField: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing RECAPTCHA',
        };
      })
      .required(),
    data: Joi.object({
      requestId: Joi.string()
        .trim()
        .error(() => {
          return {
            message: 'Invalid Request, missing request Id',
          };
        })
        .required(),
      bidAmount: Joi.number()
        .integer()
        .positive()
        .min(10)
        .max(5000)
        .error(() => {
          return {
            message: 'Invalid Request, bid amount must be between [20-5000] dollars',
          };
        })
        .required(),
    }),
  }),
};

exports.updateMyBid = {
  body: Joi.object({
    // recaptchaField: Joi.string()
    //   .trim()
    //   .error(() => {
    //     return {
    //       message: 'Invalid Request, missing RECAPTCHA',
    //     };
    //   })
    //   .required(),
    data: Joi.object({
      bidId: Joi.string()
        .trim()
        .error(() => {
          return {
            message: 'Invalid Request, missing bid Id',
          };
        })
        .required(),
      bidAmount: Joi.number()
        .integer()
        .positive()
        .min(10)
        .max(5000)
        .error(() => {
          return {
            message: 'Invalid Request, bid amount must be between [20-5000] dollars',
          };
        })
        .required(),
    }),
  }),
};

exports.markBidAsSeen = {
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
      bidId: Joi.string()
        .trim()
        .error(() => {
          return {
            message: 'Invalid Request, missing bid Id',
          };
        })
        .required(),
    }),
  }),
};

exports.achivedBidDetailsForTasker = {
  query: Joi.object({
    bidId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing bid Id',
        };
      })
      .required(),
  }),
};
