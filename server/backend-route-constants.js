//any changes to these routes will need to be reflected on the front end
module.exports = {
  API: {
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
  },
  CLIENT: {
    ENTRY: '/',
    HOME: '/home',
    PROPOSER: {
      root: '/proposer-root',
      createjob: '/proposer/create-job',
      myjobs: '/proposer/my-jobs',
      currentPostedJob: '/proposer/job/current-posted-job'
    },
    BIDDER: {
      root: '/bidder-root',
      bidNow: '/bidder/bid-now',
      mybids: '/bidder/my-bids',
      currentPostedBid: '/bidder/bids/current-posted-bid'
    },
    MY_PROFILE: '/my-profile'
  }
};
