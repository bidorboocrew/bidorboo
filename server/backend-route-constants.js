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
        // requestCharge: '/api/requestCharge',
        // payment: '/api/payment',
        myStripeAccountDetails: '/api/myStripeAccountDetails',
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
        tasksICanDo: '/api/user/tasksICanDo',
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
        myOpenJobs: '/api/job/myOpenJobs',
        alljobsToBidOn: '/api/job/alljobsToBidOn',
        myJobById: '/api/job',
        jobToBidDetailsById: '/api/job/jobToBidDetailsById',
        myAwardedJobs: '/api/job/myAwardedJobs',
        jobFullDetailsById: '/api/job/fullDetails',
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
      },
      DELETE: {
        myJobById: '/api/job',
      },
    },
    BID: {
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
      DELETE: {
        deleteOpenBid: '/api/bids/deleteOpenBid',
        cancelAwardedBid: '/api/bids/cancelAwardedBid',
      },
    },
  },
  CLIENT: {
    ENTRY: 'https://www.bidorboo.com/BIDORBOO',
    HOME: 'https://www.bidorboo.com/BIDORBOO',
    USER_ROFILE_FOR_REVIEW: 'https://www.bidorboo.com/user-profile/:userId',
    dynamicUserProfileForReview: (userId) => `https://www.bidorboo.com/user-profile/${userId}`,
    VERIFICATION: 'https://www.bidorboo.com/verification/:field/:code',
    dynamicVerification: (field, code) => `https://www.bidorboo.com/verification/${field}/${code}`,
    MYAGENDA: 'https://www.bidorboo.com/my-agenda',
    PROPOSER: {
      root: 'https://www.bidorboo.com/bdb-request',
      createjob: 'https://www.bidorboo.com/bdb-request/create-job/:templateId',
      dynamicCreateJob: (templateId) =>
        `https://www.bidorboo.com/bdb-request/create-job/${templateId}`,
      myOpenJobs: 'https://www.bidorboo.com/my-open-jobs/:tabId',
      dynamicMyOpenJobs: (tabId) => `https://www.bidorboo.com/my-open-jobs/${tabId}`,
      reviewRequestAndBidsPage: 'https://www.bidorboo.com/my-request/review-request-details/:jobId',
      dynamicReviewRequestAndBidsPage: (jobId) =>
        `https://www.bidorboo.com/my-request/review-request-details/${jobId}`,
      selectedAwardedJobPage: 'https://www.bidorboo.com/my-request/awarded-job-details/:jobId',
      dynamicSelectedAwardedJobPage: (jobId) =>
        `https://www.bidorboo.com/my-request/awarded-job-details/${jobId}`,
    },
    BIDDER: {
      root: 'https://www.bidorboo.com/bdb-offer',
      bidOnJobPage: 'https://www.bidorboo.com/bdb-offer/bid-on-job/:jobId',
      getDynamicBidOnJobPage: (jobId) => `https://www.bidorboo.com/bdb-offer/bid-on-job/${jobId}`,
      mybids: 'https://www.bidorboo.com/my-bids',
      reviewMyBidAndTheRequestDetails: 'https://www.bidorboo.com/review-my-bid-details/:bidId',
      dynamicReviewMyBidAndTheRequestDetails: (bidId) =>
        `https://www.bidorboo.com/review-my-bid-details/${bidId}`,
      currentAwardedBid: 'https://www.bidorboo.com/awarded-bid-details/:bidId',
      dynamicCurrentAwardedBid: (bidId) => `https://www.bidorboo.com/awarded-bid-details/${bidId}`,
    },
    REVIEW: {
      proposerJobReview: `https://www.bidorboo.com/bdb-request/review/:proposerId/job/:jobId/bidder/:bidderId`,
      bidderJobReview: `https://www.bidorboo.com/bdb-offer/review/:bidderId/bid/:bidId/proposer/:proposerId/job/:jobId`,
      getProposerJobReview: (proposerId, jobId, bidderId) =>
        `https://www.bidorboo.com/bdb-request/review/${proposerId}/job/${jobId}/bidder/${bidderId}`,
      getBidderJobReview: (bidderId, bidId, proposerId, jobId) =>
        `https://www.bidorboo.com/bdb-offer/review/${bidderId}/bid/${bidId}/proposer/${proposerId}/job/${jobId}`,
    },
    MY_PROFILE: {
      basicSettings: 'https://www.bidorboo.com/my-profile/basic-settings',
      paymentSettings: 'https://www.bidorboo.com/my-profile/payment-settings',
      pastRequestedServices: 'https://www.bidorboo.com/my-profile/past-requested-services',
      pastProvidedServices: 'https://www.bidorboo.com/my-profile/past-provided-services',
    },
  },
};
