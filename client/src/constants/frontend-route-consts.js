//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const API = {
  AUTH: {
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    FACEBOOK: '/api/auth/facebook',
    FACEBOOK_CALLBACK: '/api/auth/facebook/callback',
    REGISTER_NEW_USER: '/api/auth/bidorboo/register',
    LOCAL_LOGIN: '/api/auth/bidorboo/login',
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
      otherUserProfileInfo: '/api/user/otherUserProfileInfo',
      getMyPastRequestedServices: '/api/user/getMyPastRequestedServices',
      getMyPastProvidedServices: '/api/user/getMyPastProvidedServices',
    },
    PUT: {
      userDetails: '/api/user/updateProfileDetails',
      notificationSettings: '/api/user/notificationSettings',
      profilePicture: '/api/user/updateProfileImage',
      updateAppView: '/api/user/updateAppView',
      updateOnboardingDetails: '/api/user/updateOnboardingDetails',
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
      myStripeAccountDetails: '/api/myStripeAccountDetails',
    },
    PUT: {
      setupPaymentDetails: '/api/user/setupPaymentDetails',
    },
  },
  REVIEW: {
    PUT: {
      proposerSubmitReview: '/api/review/proposerSubmitReview',
      bidderSubmitReview: '/api/review/bidderSubmitReview',
    },
  },
  JOB: {
    GET: {
      myOpenJobs: '/api/job/myOpenJobs',
      alljobsToBidOn: '/api/job/alljobsToBidOn',
      myJobById: '/api/job',
      jobToBidDetailsById: '/api/job/jobToBidDetailsById',
      jobFullDetailsById: '/api/job/fullDetails',
      myAwardedJobs: '/api/job/myAwardedJobs',
      getAllMyRequests: '/api/job/getAllMyRequests',
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
      proposerConfirmsJobCompleted: '/api/job/proposerConfirmsJobCompleted',
      bidderConfirmsJobCompleted: '/api/job/bidderConfirmsJobCompleted',
      proposerDisputeJob: '/api/job/proposerDisputeJob',
      bidderDisputeJob: '/api/job/bidderDisputeJob',
    },
    DELETE: {
      myJobById: '/api/job',
    },
  },
  BID: {
    DELETE: {
      deleteOpenBid: '/api/bids/deleteOpenBid',
      cancelAwardedBid: '/api/bids/cancelAwardedBid',
    },
    POST: {
      bid: '/api/bids/postABid',
    },
    GET: {
      allMyPostedBids: '/api/bids/allMyPostedBids',
      myAwardedBids: '/api/bids/myAwardedBids',
      openBidDetails: '/api/bids/openBidDetails',
      awardedBidDetails: '/api/bids/awardedBidDetails',
    },
    PUT: {
      updateMyBid: '/api/bids/updateMyBid',
      markBidAsSeen: '/api/bids/markBidAsSeen',
      updateBidState: '/api/bids/updateBidState',
    },
  },
};

export const CLIENT = {
  ENTRY: '/BidOrBoo',
  HOME: '/BidOrBoo',
  ONBOARDING: '/on-boarding',
  USER_ROFILE_FOR_REVIEW: '/user-profile/:userId',
  dynamicUserProfileForReview: (userId) => `/user-profile/${userId}`,
  VERIFICATION: '/verification/:field/:code',
  dynamicVerification: (field, code) => `/verification/${field}/${code}`,
  PROPOSER: {
    root: '/bdb-request',
    createjob: '/bdb-request/create-job/:templateId',
    dynamicCreateJob: (templateId) => `/bdb-request/create-job/${templateId}`,
    myOpenJobs: '/my-open-jobs',
    reviewRequestAndBidsPage: '/my-request/review-request-details/:jobId',
    dynamicReviewRequestAndBidsPage: (jobId) => `/my-request/review-request-details/${jobId}`,
    selectedAwardedJobPage: '/my-request/awarded-job-details/:jobId',
    dynamicSelectedAwardedJobPage: (jobId) => `/my-request/awarded-job-details/${jobId}`,
  },
  BIDDER: {
    root: '/bdb-offer',
    bidOnJobPage: '/bdb-offer/bid-on-job/:jobId',
    getDynamicBidOnJobPage: (jobId) => `/bdb-offer/bid-on-job/${jobId}`,
    mybids: '/my-bids',
    reviewMyOpenBidAndTheRequestDetails: '/review-my-bid-details/:bidId',
    dynamicReviewMyOpenBidAndTheRequestDetails: (bidId) => `/review-my-bid-details/${bidId}`,
    awardedBidDetailsPage: '/awarded-bid-details/:bidId',
    dynamicReviewMyAwardedBidAndTheRequestDetails: (bidId) => `/awarded-bid-details/${bidId}`,
  },
  REVIEW: {
    proposerJobReview: `/bdb-request/review/job/:jobId/bidder/:bidderId`,
    bidderJobReview: `/bdb-offer/review/bid/:bidId/proposer/:proposerId`,
    getProposerJobReview: ({ jobId, bidderId }) =>
      `/bdb-request/review/job/${jobId}/bidder/${bidderId}`,
    getBidderJobReview: ({ bidId, proposerId }) =>
      `/bdb-offer/review/bid/${bidId}/proposer/${proposerId}`,
  },
  MY_PROFILE: {
    basicSettings: '/my-profile/basic-settings',
    paymentSettings: '/my-profile/payment-settings',
    pastRequestedServices: '/my-profile/past-requested-services',
    pastProvidedServices: '/my-profile/past-provided-services',
  },
};
