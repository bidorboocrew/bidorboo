const mongoose = require('mongoose');
const { Schema } = mongoose;
require('mongoose-geojson-schema');
const { encryptData, compareEncryptedWithClearData } = require('../utils/utilities');
require('mongoose-type-email');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const MAX_COMMENT_LENGTH = 500;
const MIN_COMMENT_LENGTH = 10;
const MAX_PARAGRAPH_LENGTH = 255;
const MAX_NAME_LENGTH = 25;
const MIN_NAME_LENGTH = 3;

const ratingSchema = {
  totalOfAllRatings: {
    type: Number,
    default: 0,
    validate: {
      validator: (totalOfAllRatings) => totalOfAllRatings >= 0,
      message: 'Total Rating must be greater than 0',
    },
  },
  numberOfTimesBeenRated: {
    type: Number,
    default: 0,
    validate: {
      validator: (numberOfTimesBeenRated) => numberOfTimesBeenRated >= 0,
      message: 'Number Of Times this User Was Rated must be greater than 0',
    },
  },
  globalRating: {
    type: Number,
    default: 0,
    validate: {
      validator: (globalRating) => globalRating >= 0,
      message: 'Global Rating must be greater than 0',
    },
  },
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
  latestComment: {
    type: String,
    trim: true,
    validate: {
      validator: (latestComment) => {
        return (
          latestComment.length > MIN_COMMENT_LENGTH && latestComment.length < MAX_COMMENT_LENGTH
        );
      },
      message:
        'Review Comment must be between ' +
        MIN_COMMENT_LENGTH +
        ' and ' +
        MAX_COMMENT_LENGTH +
        ' characters long',
    },
  },
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
      newPostedTasks: { type: Boolean, default: false },
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
      allowBlank: false,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      required: [
        true,
        "We couldn't locate your user Id. sorry! try registering with another email",
      ],
    },
    email: {
      emailAddress: {
        type: mongoose.SchemaTypes.Email,
        allowBlank: false,
        lowercase: true,
        trim: true,
        index: true,
        unique: [
          true,
          'This email is already registered, if you forgot the username and password chat with us and we can help you reset your details',
        ],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    // use this as default of search
    lastSearch: {
      searchRadius: {
        type: Number,
        validate: {
          validator: (searchRadius) => searchRadius >= 10 && searchRadius <= 250,
          message: 'search radius must be between 10 and 250 km',
        },
      },
      location: { type: mongoose.Schema.Types.Point, index: '2dsphere' },
      addressText: { type: String },
      tasksTypeFilter: [
        {
          type: String,
          enum: ['bdbHouseCleaning', 'bdbCarDetailing', 'bdbPetSittingWalking', 'bdbMoving'],
          default: ['bdbHouseCleaning', 'bdbCarDetailing', 'bdbPetSittingWalking', 'bdbMoving'],
        },
      ],
    },

    password: {
      type: String,
      allowBlank: false,
      trim: true,
      minlength: [6, 'password must be at least 6 chars in length'],
      maxlength: [25, 'password must be at most 25 chars in length'],
      required: false,
    },
    phone: {
      phoneNumber: {
        type: String,
        trim: true,
        allowBlank: false,
        trim: true,
        validate: {
          validator: (phoneNumber) => phoneNumber.length == 10 && /^[0-9]*$/.test(phoneNumber),
          message: 'Phone number must be 10 digits without area code and of the format 0003334444',
        },
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
    },
    displayName: {
      type: String,
      trim: true,
      allowBlank: false,
      minlength: [
        MIN_NAME_LENGTH,
        'display name must be at least ' + MIN_NAME_LENGTH + ' chars in length',
      ],
      maxlength: [
        MAX_NAME_LENGTH,
        'display name must be at most ' + MAX_NAME_LENGTH + ' chars in length',
      ],
    },
    profileImage: {
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1565728175/android-chrome-512x512.png',
      },
      public_id: { type: String },
    },
    addressText: {
      type: String,
      maxlength: [
        MAX_PARAGRAPH_LENGTH,
        'your personal paragraph can not be more than ' + MAX_PARAGRAPH_LENGTH + ' char long',
      ],
    },
    // skills: [String], // list of strings representing their skills
    personalParagraph: {
      type: String,
      maxlength: [
        MAX_PARAGRAPH_LENGTH,
        'your personal paragraph can not be more than ' + MAX_PARAGRAPH_LENGTH + ' char long',
      ],
    }, // a blob about who they are
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
      Agreed: {
        type: Boolean,
        required: [true, 'You Must Agree to BidOrBoo Terms of use to proceed'],
        default: false,
      },
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
    stripeCustomerAccId: {
      type: String,
      required: [
        true,
        'We could not establish a stripe customer account. In order to proceed please chat with us via the chat button in the footer',
      ],
    },
    // canBid: { type: Boolean, default: false },
    // canPost: { type: Boolean, default: false },
    stripeConnect: {
      accId: { type: String },
      // when payoutsEnabled && chargesEnabled
      isVerified: { type: Boolean },
      last4BankAcc: { type: String },
      payoutsEnabled: { type: Boolean },
      chargesEnabled: { type: Boolean },
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
  { timestamps: true } // createdAt and updatedAt auto  generated by mongoose
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
  return !!(this.phone && this.phone.isVerified && this.email && this.email.isVerified);
});

UserSchema.virtual('canBid').get(function() {
  // return this.email && this.email.isVerified;

  return !!(this.phone && this.phone.isVerified && this.email && this.email.isVerified);
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
