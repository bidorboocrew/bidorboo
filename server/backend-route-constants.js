//any changes to these routes will need to be reflected on the front end
module.exports = {
  API: {
    AUTH: {
      GOOGLE: '/api/auth/google',
      GOOGLE_CALLBACK: '/api/auth/google/callback',
      FACEBOOK: '/api/auth/facebook',
      FACEBOOK_CALLBACK: '/api/auth/facebook/callback',
      REGISTER_NEW_USER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
    },
    UTILS: {
      GET: {
        signCloudinaryRequest: '/api/user/paramstosign',
      },
    },
    PAYMENT: {
      POST: {
        payment: '/api/payment',
        myaccountWebhook: '/api/stripewebhook/myaccount',
        connectedAccountsWebhook: '/api/stripewebhook/connectedAccounts',
      },
      GET: {
        payment: '/api/payment',
      },
    },
    USER: {
      GET: {
        currentUser: '/api/user/currentUser',
      },
      PUT: {
        userDetails: '/api/user/updateProfileDetails',
        setupPaymentDetails: '/api/user/setupPaymentDetails',
        profilePicture: '/api/user/updateProfileImage',
      },
      POST: {
        verifyEmail: '/api/user/verifyEmail',
        verifyPhone: '/api/user/verifyPhone',
        resendVerificationEmail: '/api/user/resendVerificationEmail',
        resendVerificationMsg: '/api/user/resendVerificationMsg',
      },
    },
    JOB: {
      GET: {
        myOpenJobs: '/api/job/myOpenJobs',
        alljobsToBidOn: '/api/job/alljobsToBidOn',
        jobById: '/api/job',
        myAwardedJobs: '/api/job/myAwardedJobs',
        jobFullDetailsById: '/api/job/fullDetails',
      },
      POST: {
        searchJobs: '/api/job/search',
        newJob: '/api/job/createJob',
      },
      PUT: {
        jobImage: '/api/job/uploadImages',
        awardBidder: '/api/job/awardBidder',
      },
      DELETE: {
        jobById: '/api/job',
      },
    },
    BID: {
      POST: {
        bid: '/api/bids/postABid',
      },
      GET: {
        myOpenBids: '/api/bids/myOpenBids',
        myAwardedBids: '/api/bids/myAwardedBids',
        openBidDetails: '/api/bids/openBidDetails',
        awardedBidDetails: '/api/bids/awardedBidDetails',
      },
      PUT: {
        markBidAsSeen: '/api/bids/markBidAsSeen',
        updateBidState: '/api/bids/updateBidState',
      },
    },
  },
  CLIENT: {
    ENTRY: '/',
    VERIFICATION: '/verification/:field/:userId/:code',
    VERIFICATION_emailDynamic: (code) => `https://www.bidorboo.com/verification/Email/${code}`,
    VERIFICATION_phoneDynamic: (code) => `https://www.bidorboo.com/verification/Phone/${code}`,
    HOME: '/home',
    PROPOSER: {
      root: '/proposer-root',
      createjob: '/proposer/create-job',
      myjobs: '/proposer/my-jobs',
      currentPostedJob: '/proposer/api/job/current-posted-job',
    },
    BIDDER: {
      root: '/bidder-root',
      bidNow: '/bidder/bid-now',
      mybids: '/bidder/my-bids',
      currentPostedBid: '/bidder/api/bids/current-posted-bid',
    },
    MY_PROFILE: '/my-profile',
  },
};
