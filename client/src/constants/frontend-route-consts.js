//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const API = {
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
  USER: {
    GET: {
      currentUser: '/api/user/currentUser',
    },
    PUT: {
      userDetails: '/api/user/updateProfileDetails',
      profilePicture: '/api/user/updateProfileImage',
      setupPaymentDetails: '/api/user/setupPaymentDetails',
    },
    POST: {
      verifyEmail: '/api/user/verifyEmail',
      verifyPhone: '/api/user/verifyPhone',
      resendVerificationEmail: '/api/user/resendVerificationEmail',
      resendVerificationMsg: '/api/user/resendVerificationMsg',
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
  JOB: {
    GET: {
      myOpenJobs: '/api/job/myOpenJobs',
      alljobsToBidOn: '/api/job/alljobsToBidOn',
      jobById: '/api/job',
      jobFullDetailsById: '/api/job/fullDetails',
      myAwardedJobs: '/api/job/myAwardedJobs',
    },
    POST: {
      searchJobs: '/api/job/search',
      newJob: '/api/job/createJob',
    },
    PUT: {
      jobImage: '/api/job/uploadImages',
      awardBidder: '/api/job/awardBidder',
      updateViewedBy: '/api/job/updateViewedBy',
      updateBooedBy: '/api/job/updateBooedBy',
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
};

export const CLIENT = {
  ENTRY: '/',
  HOME: '/home',
  USER_ROFILE: '/user-profile/:userId',
  VERIFICATION: '/verification/:field/:code',
  PROPOSER: {
    root: '/proposer-root',
    createjob: '/proposer/create-job',
    getMyOpenJobsAwardedJobsTab: () => '/proposer/my-open-jobs/awardedJobs',
    getMyOpenJobReviewBidsTab: () => '/proposer/my-open-jobs/reviewBids',
    myOpenJobs: '/proposer/my-open-jobs',
    reviewRequestAndBidsPage: '/proposer/review-request-details',
    newlyPostedJob: '/proposer/new-job-details',
    awardedJobsPage: '/proposer/awarded-jobs',
    selectedAwardedJobPage: '/proposer/awarded-job-details',
  },
  BIDDER: {
    root: '/bidder-root',
    bidNow: '/bidder/bid-now',
    mybids: '/bidder/my-bids',
    currentPostedBid: '/bidder/bid-details',
    reviewJobPage: '/review-page',
    currentAwardedBid: '/bidder/awarded-bid-details',
    myAwardedBids: '/bidder/my-awarded-bids',
    myAwardedBidDetails: '/bidder/my-awarded-bid-details',
  },
  MY_PROFILE: '/my-profile',
};
