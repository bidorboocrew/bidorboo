//any changes to these routes will need to be reflected on the front end
module.exports = {
  ENTRY: '/',
  AUTH: {
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FACEBOOK: '/auth/facebook',
    FACEBOOK_CALLBACK: '/auth/facebook/callback',
    LOGOUT: '/auth/logout'
  },
  USERAPI: {
    GET_CURRENTUSER: '/user/currentUser',
    PUT_UPDATE_PROFILE_DETAILS: '/user/updateProfileDetails',
    JOB_ROUTES: {
      myjobs: '/job/myjobs',
      alljobs: '/job/alljobs',
      postASearch: '/job/search'
    },
    BIDDER_ROUTES: {
      postABid: '/bids/post-a-bid',
      getAllMyBids: '/bids/get-all-my-bids'
    }
  },
  FRONTEND: {
    ENTRY: '/',
    HOME: '/home',
    PROPOSER: {
      root: '/proposer',
      createjob: '/proposer/create-job',
      myjobs: '/proposer/my-jobs'
    },
    BIDDER: {
      root: '/bidder',
      bidNow: '/bidder/bid-now',
      mybids: '/bidder/my-bids'
    },
    MY_PROFILE: '/my-profile'
  }
};
