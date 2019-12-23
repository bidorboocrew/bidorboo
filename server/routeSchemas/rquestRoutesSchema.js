// https://github.com/gladchinda/joi-schema-validation-sourcecode/blob/master/schemas.js

// load Joi module
const { Joi } = require('celebrate');

exports.requiresRequestId = {
  query: Joi.object({
    requestId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing request Id',
        };
      })
      .required(),
  }),
};

exports.deletePostedRequestAndBidsForRequester = {
  body: Joi.object({
    requestId: Joi.string()
      .trim()
      .error(() => {
        return {
          message: 'Invalid Request, missing request Id',
        };
      })
      .required(),
  }),
};

exports.updateRequestState = {
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
      newState: Joi.string()
        .trim()
        .valid([
          'OPEN',
          'AWARDED', //
          'AWARDED_SEEN',
          'DISPUTED', // disputed request
          'AWARDED_REQUEST_CANCELED_BY_TASKER',
          'AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN',
          'AWARDED_REQUEST_CANCELED_BY_REQUESTER',
          'AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN',
          'DONE', //when Tasker confirms we set it to Payout , later a cron request will pay the account
          'DONE_SEEN',
          'DISPUTE_RESOLVED',
          'ARCHIVE', //For historical record
        ])
        .error(() => {
          return {
            message: 'Invalid Request, missing or unknown state',
          };
        })
        .required(),
    }),
  }),
};

exports.updateViewedBy = {
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
    }),
  }),
};
exports.updateBooedBy = {
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
    }),
  }),
};
exports.taskerConfirmsRequestCompleted = {
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
    }),
  }),
};
exports.requesterConfirmsRequestCompleted = {
  body: Joi.object({
    data: Joi.object({
      completionDate: Joi.date()
        .error(() => {
          return {
            message: 'Invalid Request, missing completion date',
          };
        })
        .required(),
      requestId: Joi.string()
        .trim()
        .error(() => {
          return {
            message: 'Invalid Request, missing request Id',
          };
        })
        .required(),
    }),
  }),
};

exports.requesterDisputeRequest = {
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
      requesterDispute: Joi.object({
        reason: Joi.string()
          .trim()
          .min(2)
          .max(500)
          .error(() => {
            return {
              message: 'Invalid Request, missing request Id',
            };
          })
          .required(),
        details: Joi.string()
          .trim()
          .min(10)
          .max(1000)
          .error(() => {
            return {
              message: 'Invalid Request, missing request Id',
            };
          })
          .required(),
      })
        .error(() => {
          return {
            message: 'Invalid Request, missing requester Dispute',
          };
        })
        .required(),
    }),
  }),
};

exports.taskerDisputeRequest = {
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
      taskerDispute: Joi.object({
        reason: Joi.string()
          .trim()
          .min(2)
          .max(500)
          .error(() => {
            return {
              message: 'Invalid Request, missing request Id',
            };
          })
          .required(),
        details: Joi.string()
          .trim()
          .min(10)
          .max(1000)
          .error(() => {
            return {
              message: 'Invalid Request, missing request Id',
            };
          })
          .required(),
      })
        .error(() => {
          return {
            message: 'Invalid Request, missing requester Dispute',
          };
        })
        .required(),
    }),
  }),
};
exports.updateSearchThenSearchRequests = {
  body: Joi.object({
    data: Joi.object({
      addressText: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .error(() => {
          return {
            message: 'Invalid Request, missing address text',
          };
        })
        .required(),
      tasksTypeFilter: Joi.array()
        .min(1)
        .items(
          Joi.string()
            .trim()
            .valid(['bdbHouseCleaning', 'bdbCarDetailing', 'bdbPetSittingWalking', 'bdbMoving'])
            .error(() => {
              return {
                message: 'Invalid Request, missing or invalid task type',
              };
            })
        )
        .error(() => {
          return {
            message: 'Invalid Request, missing or invalid task type filter',
          };
        })
        .required(),
      location: Joi.object({
        lat: Joi.number()
          .min(-90)
          .max(90)
          .error(() => {
            return {
              message: 'Invalid Request, missing or invalid lattitude',
            };
          })
          .required(),
        lng: Joi.number()
          .min(-180)
          .max(180)
          .error(() => {
            return {
              message: 'Invalid Request, missing or invalid longitutde',
            };
          })
          .required(),
      })
        .error(() => {
          return {
            message: 'Invalid Request, missing search location',
          };
        })
        .required(),
      searchRadius: Joi.number()
        .min(0)
        .max(200)
        .error(() => {
          return {
            message: 'Invalid Request, missing search radius',
          };
        })
        .required(),
    }),
  }),
};
