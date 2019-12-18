//any changes to these routes will need to be reflected on the front end
module.exports = {
  API: {
    PUSH: {
      POST: {
        pushNotification: '/api/pushNotification',
        registerPushNotification: '/api/push/register',
      },
      DELETE: {
        unregisterPushNotification: '/api/push/unregister',
      },
    },
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
    PAYMENT: {
      POST: {
        payment: '/api/payment',
        personsWebhook: '/api/stripewebhook/persons',
        connectedAccountsWebhook: '/api/stripewebhook/connectedAccounts',
        payoutsWebhook: '/api/stripewebhook/payoutsWebhook',
        checkoutFulfillment: '/api/stripewebhook/checkoutFulfillment',
        chargeSucceededWebhook: '/api/stripewebhook/chargeSucceeded',
      },
      GET: {
        accountLinkForSetupAndVerification: '/api/accountLinkForSetupAndVerification',
        myStripeAccountDetails: '/api/myStripeAccountDetails',
        accountLinkForUpdatingVerification: '/api/accountLinkForUpdatingVerification',
      },
      PUT: {
        setupPaymentDetails: '/api/user/setupPaymentDetails',
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
    REVIEW: {
      PUT: {
        proposerSubmitReview: '/api/review/proposerSubmitReview',
        bidderSubmitReview: '/api/review/bidderSubmitReview',
      },
    },
    JOB: {
      GET: {
        myRequestsSummary: '/api/job/myRequestsSummary',
        postedJobAndBidsForRequester: '/api/job',
        awardedJobFullDetailsForRequester: '/api/job/awardedJobFullDetailsForRequester',

        alljobsToBidOn: '/api/job/alljobsToBidOn',
        jobToBidOnDetailsForTasker: '/api/job/jobToBidOnDetailsForTasker',
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
        postedJobAndBidsForRequester: '/api/job',
      },
    },
    BID: {
      POST: {
        bid: '/api/bids/postABid',
      },
      GET: {
        myPostedBidsSummary: '/api/bids/myPostedBidsSummary',
        myAwardedBids: '/api/bids/myAwardedBids',
        openBidDetails: '/api/bids/openBidDetails',
        awardedBidDetailsForTasker: '/api/bids/awardedBidDetailsForTasker',
      },
      PUT: {
        updateMyBid: '/api/bids/updateMyBid',
        markBidAsSeen: '/api/bids/markBidAsSeen',
      },
      DELETE: {
        deleteOpenBid: '/api/bids/deleteOpenBid',
        cancelAwardedBid: '/api/bids/cancelAwardedBid',
      },
    },
  },
  CLIENT: {
    ENTRY: 'https://www.bidorboo.ca/BidOrBoo',
    HOME: 'https://www.bidorboo.ca/BidOrBoo',
    USER_ROFILE_FOR_REVIEW: 'https://www.bidorboo.ca/user-profile/:userId',
    dynamicUserProfileForReview: (userId) => `https://www.bidorboo.ca/user-profile/${userId}`,
    dynamicVerification: (field, code) => `https://www.bidorboo.ca/verification/${field}/${code}`,
    MYAGENDA: 'https://www.bidorboo.ca/my-agenda',
    PROPOSER: {
      root: 'https://www.bidorboo.ca/bdb-request',
      createjob: 'https://www.bidorboo.ca/bdb-request/create-job/:templateId',
      dynamicCreateJob: (templateId) =>
        `https://www.bidorboo.ca/bdb-request/create-job/${templateId}`,
      myOpenJobs: 'https://www.bidorboo.ca/my-open-jobs/:tabId',
      dynamicMyOpenJobs: (tabId) => `https://www.bidorboo.ca/my-open-jobs/${tabId}`,
      reviewRequestAndBidsPage: 'https://www.bidorboo.ca/my-request/review-request-details/:jobId',
      dynamicReviewRequestAndBidsPage: (jobId) =>
        `https://www.bidorboo.ca/my-request/review-request-details/${jobId}`,
      selectedAwardedJobPage: 'https://www.bidorboo.ca/my-request/awarded-job-details/:jobId',
      dynamicSelectedAwardedJobPage: (jobId) =>
        `https://www.bidorboo.ca/my-request/awarded-job-details/${jobId}`,
    },
    BIDDER: {
      root: 'https://www.bidorboo.ca/bdb-offer',
      bidOnJobPage: 'https://www.bidorboo.ca/bdb-offer/bid-on-job/:jobId',
      getDynamicBidOnJobPage: (jobId) => `https://www.bidorboo.ca/bdb-offer/bid-on-job/${jobId}`,
      mybids: 'https://www.bidorboo.ca/my-bids',
      reviewMyBidAndTheRequestDetails: 'https://www.bidorboo.ca/review-my-bid-details/:bidId',
      dynamicReviewMyBidAndTheRequestDetails: (bidId) =>
        `https://www.bidorboo.ca/review-my-bid-details/${bidId}`,
      currentAwardedBid: 'https://www.bidorboo.ca/awarded-bid-details/:bidId',
      dynamicCurrentAwardedBid: (bidId) => `https://www.bidorboo.ca/awarded-bid-details/${bidId}`,
    },
    REVIEW: {
      proposerJobReview: `https://www.bidorboo.ca/bdb-request/review/:jobId`,
      bidderJobReview: `https://www.bidorboo.ca/bdb-offer/review/:bidId`,
      getProposerJobReview: ({ jobId }) => `https://www.bidorboo.ca/bdb-request/review/${jobId}`,
      getBidderJobReview: ({ bidId }) => `https://www.bidorboo.ca/bdb-offer/review/${bidId}`,
    },
    MY_PROFILE: {
      myNotifications: '/my-profile/notification-settings',
      basicSettings: 'https://www.bidorboo.ca/my-profile/basic-settings',
      paymentSettings: 'https://www.bidorboo.ca/my-profile/payment-settings',
      pastRequestedServices: 'https://www.bidorboo.ca/my-profile/past-requested-services',
      pastProvidedServices: 'https://www.bidorboo.ca/my-profile/past-provided-services',
    },
  },
};
