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
      signCloudinaryRequest: '/api/user/paramstosign'
    }
  },
  USER: {
    GET: {
      currentUser: '/api/user/currentUser',
    },
    PUT: {
      userDetails: '/api/user/updateProfileDetails',
      profilePicture: '/api/user/updateProfileImage',
    },
  },
  PAYMENT: {
    POST: {
      payment: '/api/payment',
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
    },
  },
};

export const CLIENT = {
  ENTRY: '/',
  HOME: '/home',
  PROPOSER: {
    root: '/proposer-root',
    createjob: '/proposer/create-job',
    myOpenJobs: '/proposer/my-open-jobs',
    selectedPostedJobPage: '/proposer/job-details',
    awardedJobsPage: '/proposer/awarded-jobs',
    selectedAwardedJobPage: '/proposer/awarded-job-details',
  },
  BIDDER: {
    root: '/bidder-root',
    bidNow: '/bidder/bid-now',
    mybids: '/bidder/my-bids',
    currentPostedBid: '/bidder/bid-details',
    currentAwardedBid: '/bidder/awarded-bid-details',
    myAwardedBids: '/bidder/my-awarded-bids',
    myAwardedBidDetails: '/bidder/my-awarded-bid-details',
  },
  MY_PROFILE: '/my-profile',
};
