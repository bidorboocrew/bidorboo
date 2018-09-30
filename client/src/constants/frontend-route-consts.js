//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const API = {
  AUTH: {
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    FACEBOOK: '/api/auth/facebook',
    FACEBOOK_CALLBACK: '/api/auth/facebook/callback',
    REGISTER_NEW_USER: '/api/auth/register',
    LOGOUT: '/api/auth/logout'
  },
  USER: {
    GET: {
      currentUser: '/api/user/currentUser'
    },
    PUT: {
      userDetails: '/api/user/updateProfileDetails',
      profilePicture: '/api/user/updateProfileImage'
    }
  },
  JOB: {
    GET: {
      myjobs: '/api/job/myJobs',
      alljobs: '/api/job/allJobs',
      jobById: '/api/job/:jobId'
    },
    POST: {
      searchJobs: '/api/job/search',
      newJob: '/api/job/createJob'
    },
    PUT: {
      jobImage: '/api/job/uploadImages'
    },
    DELETE: {
      jobById: '/api/job/',
      jobImage: '/api/job/'
    }
  },
  BID: {
    POST: {
      bid: '/api/bids/postABid'
    },
    GET: {
      myBids: '/api/bids/myBids'
    }
  }
};

export const CLIENT = {
  ENTRY: '/',
  HOME: '/home',
  PROPOSER: {
    root: '/proposer-root',
    createjob: '/proposer/create-job',
    myjobs: '/proposer/my-jobs',
    currentPostedJob: '/proposer/job-details'
  },
  BIDDER: {
    root: '/bidder-root',
    bidNow: '/bidder/bid-now',
    mybids: '/bidder/my-bids',
    currentPostedBid: '/bidder/bid-details'
  },
  MY_PROFILE: '/my-profile'
};
