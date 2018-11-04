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
  USER: {
    GET: {
      currentUser: '/api/user/currentUser',
    },
    PUT: {
      userDetails: '/api/user/updateProfileDetails',
      profilePicture: '/api/user/updateProfileImage',
    },
  },
  JOB: {
    GET: {
      myOpenJobs: '/api/job/myOpenJobs',
      alljobs: '/api/job/allJobs',
      jobById: '/api/job/:jobId',
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
      jobById: '/api/job/delete',
    },
  },
  BID: {
    POST: {
      bid: '/api/bids/postABid',
    },
    GET: {
      myBids: '/api/bids/myBids',
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
    activeBidsPage: '/bidder/active-bids',
  },
  MY_PROFILE: '/my-profile',
};
