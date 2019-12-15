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
      loggedOutRequestEmailVerificationCode: '/api/user/requestEmailVerificationCode',
      updateUserPassword: '/api/user/updateUserPassword',
    },
  },
  PAYMENT: {
    POST: {
      payment: '/api/payment',
      myaccountWebhook: '/api/stripewebhook/myaccount',
      connectedAccountsWebhook: '/api/stripewebhook/connectedAccounts',
    },
    GET: {
      accountLinkForSetupAndVerification: '/api/accountLinkForSetupAndVerification',
      accountLinkForUpdatingVerification: '/api/accountLinkForUpdatingVerification',
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
      getMyRequestsSummary: '/api/job/getMyRequestsSummary',
      alljobsToBidOn: '/api/job/alljobsToBidOn',
      myJobById: '/api/job',
      jobToBidDetailsById: '/api/job/jobToBidDetailsById',
      jobFullDetailsById: '/api/job/fullDetails',
      myAwardedJobs: '/api/job/myAwardedJobs',
      getAllMyRequests: '/api/job/getAllMyRequests',
    },
    POST: {
      jobImage: '/api/job/uploadImages',
      searchJobs: '/api/job/search',
      newJob: '/api/job/createJob',
      updateSearchThenSearchJobs: '/api/user/updateSearchThenSearchJobs',
    },
    PUT: {
      updateViewedBy: '/api/job/updateViewedBy',
      updateBooedBy: '/api/job/updateBooedBy',
      proposerConfirmsJobCompleted: '/api/job/proposerConfirmsJobCompleted',
      bidderConfirmsJobCompleted: '/api/job/bidderConfirmsJobCompleted',
      proposerDisputeJob: '/api/job/proposerDisputeJob',
      bidderDisputeJob: '/api/job/bidderDisputeJob',
      updateJobState: '/api/job/updateJobState',
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
  HOME: '/',
  TOS: '/terms-of-service',
  LOGIN_OR_REGISTER: '/login-and-registration',
  ONBOARDING: '/on-boarding',
  RESETPASSWORD: '/reset-password',
  USER_ROFILE_FOR_REVIEW: '/user-profile/:userId',
  dynamicUserProfileForReview: (userId) => `/user-profile/${userId}`,
  dynamicVerification: (field, code) => `/verification/${field}/${code}`,
  PROPOSER: {
    root: '/bdb-request/root',
    createjob: '/bdb-request/create-job/:templateId',
    dynamicCreateJob: (templateId) => `/bdb-request/create-job/${templateId}`,
    myRequestsPage: '/my-open-requests',
    reviewRequestAndBidsPage: '/my-request/review-request-details/:jobId',
    dynamicReviewRequestAndBidsPage: (jobId) => `/my-request/review-request-details/${jobId}`,
    selectedAwardedJobPage: '/my-request/awarded-job-details/:jobId',
    dynamicSelectedAwardedJobPage: (jobId) => `/my-request/awarded-job-details/${jobId}`,
  },
  BIDDER: {
    root: '/bdb-offer/root',
    bidOnJobPage: '/bdb-offer/bid-on-job/:jobId',
    getDynamicBidOnJobPage: (jobId) => `/bdb-offer/bid-on-job/${jobId}`,
    mybids: '/my-bids',
    reviewMyOpenBidAndTheRequestDetails: '/review-my-bid-details/:bidId',
    dynamicReviewMyOpenBidAndTheRequestDetails: (bidId) => `/review-my-bid-details/${bidId}`,
    awardedBidDetailsPage: '/awarded-bid-details/:bidId',
    dynamicReviewMyAwardedBidAndTheRequestDetails: (bidId) => `/awarded-bid-details/${bidId}`,
  },
  REVIEW: {
    proposerJobReview: `/bdb-request/review/:jobId`,
    bidderJobReview: `/bdb-offer/review/:jobId`,
    getProposerJobReview: ({ jobId }) => `/bdb-request/review/${jobId}`,
    getBidderJobReview: ({ jobId }) => `/bdb-offer/review/${jobId}`,
  },
  MY_PROFILE: {
    myNotifications: '/my-profile/notification-settings',
    basicSettings: '/my-profile/basic-settings',
    paymentSettings: '/my-profile/payment-settings',
    pastRequestedServices: '/my-profile/past-requested-services',
    pastProvidedServices: '/my-profile/past-provided-services',
  },
};
