const mongoose = require('mongoose');
require('mongoose-geojson-schema');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const moment = require('moment-timezone');

const { detroyExistingImg } = require('../utils/utilities');

const { Schema } = mongoose;

const MAX_TITLE_LENGTH = 20;
const MIN_TITLE_LENGTH = 5;

const MAX_DESCRIPTION_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 20;

const MAX_ADDRESS_LENGTH = 300;
const MIN_ADDRESS_LENGTH = 5;

const MIN_BID_AMOUNT = 10 * 100;
const MAX_BID_AMOUNT = 5000 * 100;
const MAX_IMAGE_COUNT = 3;

const RequestSchema = new Schema(
  {
    _ownerRef: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    _bidsListRef: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }],
    _awardedBidRef: {
      type: Schema.Types.ObjectId,
      ref: 'BidModel',
    },
    state: {
      type: String,
      default: 'OPEN',
      index: true,
      enum: [
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
      ],
    },
    templateId: {
      type: String,
      trim: true,
      required: true,
      enum: ['bdbCarDetailing', 'bdbHouseCleaning', 'bdbPetSittingWalking', 'bdbMoving'],
    },
    reported: { type: Number },
    _reviewRef: { type: Schema.Types.ObjectId, ref: 'ReviewModel' },
    latestCheckoutSession: { type: String },
    processedPayment: {
      paymentIntentId: { type: String },
      paymentMethodId: { type: String },
      destinationStripeAcc: { type: String },
      chargeId: { type: String },
      applicationFeeAmount: { type: Number, min: MIN_BID_AMOUNT * 100, max: MAX_BID_AMOUNT * 100 },
      amount: { type: Number, min: MIN_BID_AMOUNT * 100, max: MAX_BID_AMOUNT * 100 },
      refund: {
        amount: { type: Number, min: MIN_BID_AMOUNT, max: MAX_BID_AMOUNT },
        paymentIntentId: { type: String },
        id: { type: String },
        status: { type: String },
      },
    },
    payoutDetails: {
      id: { type: String },
      status: { type: String },
    },
    dispute: {
      taskerDispute: {
        reason: { type: String },
        details: { type: String },
      },
      requesterDispute: {
        reason: { type: String },
        details: { type: String },
      },
      bidOrBooCrewResolution: {
        requesterResolution: { type: String },
        taskerResolution: { type: String },
      },
    },
    taskerConfirmedCompletion: { type: Boolean, default: false },
    // when a tasker cancels on this request hide it from them to avoid future bids by the asshole who canceled
    hideFrom: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }], //array of people who saw this/booed no longer wish to see it ..etc
    viewedBy: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    detailedDescription: {
      type: String,
      trim: true,
      maxlength: [
        MAX_DESCRIPTION_LENGTH,
        'description text can not be longer than ' + MAX_DESCRIPTION_LENGTH + ' characters',
      ],
      minlength: [
        MIN_DESCRIPTION_LENGTH,
        'description text can not be less than ' + MIN_DESCRIPTION_LENGTH + ' characters',
      ],
      required: [true, 'description is required'],
    },
    location: { type: mongoose.Schema.Types.Point, index: '2dsphere', required: true },
    requestTitle: {
      type: String,
      trim: true,
      maxlength: [
        MAX_TITLE_LENGTH,
        'title text can not be longer than ' + MAX_TITLE_LENGTH + ' characters',
      ],
      minlength: [
        MIN_TITLE_LENGTH,
        'title text can not be less than ' + MIN_TITLE_LENGTH + ' characters',
      ],
      required: [true, 'request title is required'],
    },
    addressText: {
      type: String,
      trim: true,
      maxlength: [
        MAX_ADDRESS_LENGTH,
        'Address text can not be longer than ' + MAX_ADDRESS_LENGTH + ' characters',
      ],
      minlength: [
        MIN_ADDRESS_LENGTH,
        'Address text can not be less than ' + MIN_ADDRESS_LENGTH + ' characters',
      ],
      required: [true, 'title is required'],
    },
    startingDateAndTime: {
      type: Date,
      required: true,
      index: true,
      required: true,
      validate: {
        validator: (val) => {
          const now = moment()
            .tz('America/Toronto')
            .toISOString();
          const normalizedStartDate = moment(val)
            .tz('America/Toronto')
            .toISOString();
          const isRequestScheduledTimePastDue = moment(normalizedStartDate).isSameOrBefore(now);
          return !isRequestScheduledTimePastDue;
        },
        message: 'You can attach a maximum of ' + MAX_IMAGE_COUNT + 'images',
      },
    },
    completionDate: {
      type: Date,
    },
    taskImages: {
      type: [
        {
          url: { type: String },
          public_id: { type: String },
        },
      ],
      validate: {
        validator: (val) => val && val.length <= MAX_IMAGE_COUNT,
        message: 'You can attach a maximum of ' + MAX_IMAGE_COUNT + 'images',
      },
    },
    extras: { type: Object },
  },
  { timestamps: true } // createdAt and updatedAt auto generated by mongoose
);

RequestSchema.virtual('requestTemplateDisplayTitle').get(function() {
  const templateIdToDisplayName = {
    bdbHouseCleaning: 'House Cleaning',
    bdbCarDetailing: 'Car Detailing',
    bdbPetSittingWalking: 'Pet Sitting/Walking',
    bdbMoving: 'Moving/Lifting Helpers',
  };
  return templateIdToDisplayName[this.templateId];
});

RequestSchema.virtual('isPastDue').get(function() {
  const now = moment()
    .tz('America/Toronto')
    .toISOString();
  const requestStartDate = this.startingDateAndTime;

  // normalize the start date to the same timezone to comapre
  const normalizedStartDate = moment(requestStartDate)
    .tz('America/Toronto')
    .toISOString();
  const isRequestScheduledTimePastDue = moment(normalizedStartDate).isSameOrBefore(now);

  return isRequestScheduledTimePastDue;
});

RequestSchema.virtual('isHappeningToday').get(function() {
  const startOfDay = moment()
    .tz('America/Toronto')
    .startOf('day')
    .toISOString();
  const endOfDay = moment()
    .tz('America/Toronto')
    .endOf('day')
    .toISOString();

  const requestStartDate = this.startingDateAndTime;
  // normalize the start date to the same timezone to comapre
  const normalizedStartDate = moment(requestStartDate)
    .tz('America/Toronto')
    .toISOString();

  const isRequestHappeningAfterToday = moment(normalizedStartDate).isSameOrAfter(startOfDay);
  const isRequestHappeningBeforeTomorrow = moment(normalizedStartDate).isSameOrBefore(endOfDay);
  return isRequestHappeningAfterToday && isRequestHappeningBeforeTomorrow;
});

RequestSchema.virtual('isHappeningSoon').get(function() {
  const theNext24Hours = moment()
    .tz('America/Toronto')
    .add(1, 'day')
    .startOf('day');

  const requestStartDate = this.startingDateAndTime;
  // normalize the start date to the same timezone to comapre
  const normalizedStartDate = moment(requestStartDate).tz('America/Toronto');

  var duration = moment.duration(theNext24Hours.diff(normalizedStartDate));
  var hours = duration.asHours();

  const isNotPastDue = moment(theNext24Hours.toISOString()).isAfter(
    normalizedStartDate.toISOString()
  );

  // if request is about to expire in 48 hours
  return hours <= 48 && isNotPastDue;
});

RequestSchema.plugin(mongooseLeanVirtuals);

RequestSchema.pre('remove', async function(next) {
  const BidModel = mongoose.model('BidModel');
  const UserModel = mongoose.model('UserModel');
  try {
    const bidsToBeRemoved = await BidModel.find({ _id: { $in: this._bidsListRef } })
      .lean()
      .exec();
    if (bidsToBeRemoved && bidsToBeRemoved.length > 0) {
      let taskers = [];
      bidsToBeRemoved.forEach((bid) => {
        taskers.push(bid._taskerRef._id);
      });

      await UserModel.update(
        { _id: { $in: taskers } },
        { $pull: { _postedBidsRef: { $in: this._bidsListRef } } },
        { multi: true }
      )
        .lean()
        .exec();
    }

    await UserModel.findByIdAndUpdate(this._ownerRef, {
      $pull: { _postedRequestsRef: { $in: [this._id] } },
    }).exec();

    await BidModel.remove({ _id: { $in: this._bidsListRef } }).exec();
    if (this.taskImages && this.taskImages.length > 0) {
      await Promise.all(this.taskImages.map(({ public_id }) => detroyExistingImg(public_id)));
    }
    next();
  } catch (e) {
    e.safeMsg = 'Encountered an error while deleting this request';
    return next(e);
  }
});

mongoose.model('RequestModel', RequestSchema);
