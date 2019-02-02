//any changes to these routes will need to be reflected on the front end
module.exports = {
  API: {
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
    USER: {
      GET: {
        currentUser: '/api/user/currentUser',
        otherUserProfileInfo: '/api/user/otherUserProfileInfo',
        getMyPastRequestedServices: '/api/user/getMyPastRequestedServices',
        getMyPastProvidedServices: '/api/user/getMyPastProvidedServices',
      },
      PUT: {
        userDetails: '/api/user/updateProfileDetails',
        profilePicture: '/api/user/updateProfileImage',
      },
      POST: {
        verifyEmail: '/api/user/verifyEmail',
        verifyPhone: '/api/user/verifyPhone',
        resendVerificationEmail: '/api/user/resendVerificationEmail',
        resendVerificationMsg: '/api/user/resendVerificationMsg',
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
        updateViewedBy: '/api/job/updateViewedBy',
        updateBooedBy: '/api/job/updateBooedBy',
        proposerConfirmsJobCompleted: '/api/job/proposerConfirmsJobCompleted',
        bidderConfirmsJobCompleted: '/api/job/bidderConfirmsJobCompleted',
        proposerDisputeJob: '/api/job/proposerDisputeJob',
        bidderDisputeJob: '/api/job/bidderDisputeJob',
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
        updateMyBid: '/api/bids/updateMyBid',
        markBidAsSeen: '/api/bids/markBidAsSeen',
        updateBidState: '/api/bids/updateBidState',
      },
    },
  },
  CLIENT: {
    ENTRY: '/',
    HOME: '/home',
    USER_ROFILE: '/user-profile/:userId',
    VERIFICATION: '/verification/:field/:code',
    VERIFICATION_phoneDynamic: (code) => `www.bidorboo.com/verification/Phone/${code}`,
    VERIFICATION_emailDynamic: (code) => `www.bidorboo.com/verification/Email/${code}`,
    PROPOSER: {
      root: '/proposer-root',
      createjob: '/proposer/create-job',
      getMyOpenJobsAwardedJobsTab: () => '/proposer/my-open-jobs/awardedJobs',
      getMyOpenJobsPostedJobsTab: () => '/proposer/my-open-jobs/postedJobs',
      myOpenJobs: '/proposer/my-open-jobs',
      reviewRequestAndBidsPage: '/proposer/review-request-details',
      newlyPostedJob: '/proposer/new-job-details',
      awardedJobsPage: '/proposer/awarded-jobs',
      selectedAwardedJobPage: '/proposer/awarded-job-details',
    },
    BIDDER: {
      root: '/bidder-root',
      BidOnJobPage: '/bidder/bid-on-job',
      mybids: '/bidder/my-bids',
      reviewMyBidAndTheRequestDetails: '/bidder/review-my-bid-details',
      reviewJobPage: '/review-page',
      currentAwardedBid: '/bidder/awarded-bid-details',
      myAwardedBids: '/bidder/my-awarded-bids',
      myAwardedBidDetails: '/bidder/my-awarded-bid-details',
    },
    MY_PROFILE: '/my-profile',
  },
};
