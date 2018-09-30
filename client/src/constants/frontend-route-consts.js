//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const API = {
  AUTH: {
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FACEBOOK: '/auth/facebook',
    FACEBOOK_CALLBACK: '/auth/facebook/callback',
    REGISTER_NEW_USER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  USER: {
    GET: {
      currentUser: '/user/currentUser'
    },
    PUT: {
      userDetails: '/user/updateProfileDetails',
      profilePicture: '/user/updateProfileImage'
    }
  },
  JOB: {
    GET: {
      myjobs: '/job/myJobs',
      alljobs: '/job/allJobs',
      jobById: '/job/:jobId'
    },
    POST: {
      searchJobs: '/job/search',
      newJob: '/job/createJob'
    },
    PUT: {
      jobImage: '/job/uploadImages'
    },
    DELETE: {
      jobById: '/job',
      jobImage: '/job'
    }
  },
  BID: {
    POST: {
      bid: '/bids/postABid'
    },
    GET: {
      myBids: '/bids/myBids'
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
    currentPostedJob: '/proposer/job/details'
  },
  BIDDER: {
    root: '/bidder-root',
    bidNow: '/bidder/bid-now',
    mybids: '/bidder/my-bids',
    currentPostedBid: '/bidder/bids/details'
  },
  MY_PROFILE: '/my-profile'
};
