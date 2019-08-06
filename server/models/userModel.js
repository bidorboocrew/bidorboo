const mongoose = require('mongoose');
const { Schema } = mongoose;
require('mongoose-geojson-schema');
const { encryptData, compareEncryptedWithClearData } = require('../utils/utilities');
require('mongoose-type-email');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const MAX_PARAGRAPH_LENGTH = 500;
const MAX_NAME_LENGTH = 50;

const ratingSchema = {
  totalOfAllRatings: { type: Number, default: 0 },
  numberOfTimesBeenRated: { type: Number, default: 0 },
  globalRating: { type: Number, default: 0 },
  fulfilledBids: {
    type: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }],
  },
  canceledBids: {
    type: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }],
  },
  fulfilledJobs: {
    type: [{ type: Schema.Types.ObjectId, ref: 'JobModel' }],
  },
  canceledJobs: {
    type: [{ type: Schema.Types.ObjectId, ref: 'JobModel' }],
  },
  latestComment: { type: String, trim: true },
};

const UserSchema = new Schema(
  {
    appView: {
      type: String,
      default: 'PROPOSER',
      enum: ['PROPOSER', 'BIDDER'],
    },
    isGmailUser: {
      type: Boolean,
      default: false,
    },
    isFbUser: {
      type: Boolean,
      default: false,
    },
    notifications: {
      push: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
      text: {
        type: Boolean,
        default: true,
      },
    },
    notifyMeAboutNewTasks: {
      sendNotification: { type: Boolean, default: true },
    },
    _postedJobsRef: {
      type: [{ type: Schema.Types.ObjectId, ref: 'JobModel' }],
      index: true,
    }, //list of all jobs you have posted
    _postedBidsRef: {
      type: [{ type: Schema.Types.ObjectId, ref: 'BidModel' }],
      index: true,
    }, // list of all bids you made
    _asBidderReviewsRef: [{ type: Schema.Types.ObjectId, ref: 'ReviewModel' }],
    _asProposerReviewsRef: [{ type: Schema.Types.ObjectId, ref: 'ReviewModel' }],
    rating: ratingSchema,
    userId: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      required: true,
    },
    email: {
      emailAddress: {
        type: mongoose.SchemaTypes.Email,
        allowBlank: false,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    // use this as default of search
    lastSearch: {
      searchRadius: { type: Number },
      location: { type: mongoose.Schema.Types.Point, index: '2dsphere' },
      addressText: { type: String },
    },
    password: {
      type: String,
      allowBlank: false,
      trim: true,
      minlength: 6,
      required: false,
    },
    phone: {
      phoneNumber: {
        type: String,
        trim: true,
        allowBlank: false,
        trim: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    verification: {
      email: {
        type: Map,
        of: String,
      },
      phone: {
        type: Map,
        of: String,
      },
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: MAX_NAME_LENGTH,
    },
    profileImage: {
      url: { type: String, default: 'https://static.thenounproject.com/png/630729-200.png' },
      public_id: { type: String },
    },
    addressText: { type: String, maxlength: MAX_PARAGRAPH_LENGTH },
    // skills: [String], // list of strings representing their skills
    personalParagraph: { type: String, maxlength: MAX_PARAGRAPH_LENGTH }, // a blob about who they are
    // paymentRefs: [String], // ID to fetch their payments through our system to generate an invoice
    membershipStatus: {
      type: String,
      enum: [
        'NEW_MEMBER',
        'ONBOARDED_MEMBER',
        'VERIFIED_MEMBER',
        'BRONZE_MEMBER',
        'SILVER_MEMBER',
        'GOLDEN_MEMBER',
        'PLATINUM_MEMBER',
      ],
      default: 'NEW_MEMBER',
    },
    pushSubscription: { type: String },
    userRole: {
      type: String,
      enum: ['ADMIN', 'REGULAR'],
      default: 'REGULAR',
    },
    tos_acceptance: {
      Agreed: { type: Boolean, required: true, default: false },
      date: { type: Date },
      ip: { type: String },
    },
    settings: { type: Object },
    extras: { type: Object },
    picId: {
      front: { type: String },
      back: { type: String },
      isVerified: { type: Boolean },
    },
    stripeConnect: {
      accId: { type: String },
      // when payoutsEnabled && chargesEnabled
      isVerified: { type: Boolean, default: false },
      last4BankAcc: { type: String },
      payoutsEnabled: { type: Boolean, default: false },
      chargesEnabled: { type: Boolean, default: false },
      processedWebhookEventIds: [{ type: String }],
      accRequirements: {
        disabled_reason: { type: String },
        current_deadline: { type: Number },
        past_due: [{ type: String }],
        currently_due: [{ type: String }],
        eventually_due: [{ type: String }],
      },
    },
  },
  { timestamps: true, toObject: { virtuals: true } } // createdAt and updatedAt auto  generated by mongoose
);

UserSchema.pre('save', async function(next) {
  if (this.password) {
    this.password = await encryptData(this.password);
    if (this.password.errorMsg) {
      // error case
      next(this.password);
    }
  }
  next();
});

UserSchema.virtual('canPost').get(function() {
  // return this.phone && this.phone.isVerified &&
  return this.email && this.email.isVerified;
});

UserSchema.virtual('canBid').get(function() {
  return this.email && this.email.isVerified;

  // return !!(
  // this.phone &&
  // this.phone.isVerified &&
  // this.email &&
  // this.email.isVerified
  // // this.stripeConnect &&
  // this.stripeConnect.accId &&
  // this.stripeConnect.isVerified &&
  // this.stripeConnect.payoutsEnabled
  // );
});

UserSchema.virtual('disabledReasonMsg').get(function() {
  const disabledReasonDisplayMsg = {
    fields_needed:
      'Additional verification information is required to enable payout or charge capabilities on this account',
    listed:
      'Account might be a match on a prohibited persons or companies list (Stripe will investigate and either reject or reinstate the account appropriately)',
    'rejected.fraud': 'Account is rejected due to suspected fraud or illegal activity',
    'rejected.listed':
      'Account is rejected due to a match on a third-party prohibited persons or companies list (such as financial services provider or government)',
    'rejected.terms_of_service': 'Account is rejected due to suspected terms of service violations',
    'rejected.other': 'Account is rejected for another reason',
    under_review: 'Account is under review by Stripe',
    other: 'Account is not rejected but is disabled for another reason while being reviewed',
  };
  return this.stripeConnect &&
    this.stripeConnect.requirements &&
    this.stripeConnect.requirements.disabled_reason
    ? disabledReasonDisplayMsg[this.stripeConnect.requirements.disabled_reason]
    : '';
});

UserSchema.methods.checkUserPassword = async function(candidatePassword) {
  const isTheRightPassword = await compareEncryptedWithClearData(candidatePassword, this.password);
  return isTheRightPassword;
};

UserSchema.pre('update', async function(next) {
  // this probably does not work what so ever
  if (this.password) {
    this.password = await encryptData(this.password);
    if (this.password.errorMsg) {
      // error case
      next(this.password);
    }
  }
  next();
});

UserSchema.plugin(mongooseLeanVirtuals);

mongoose.model('UserModel', UserSchema);
