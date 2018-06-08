//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const BACKENDROUTES = {
  ENTRY: '/',
  AUTH: {
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FACEBOOK: '/auth/facebook',
    FACEBOOK_CALLBACK: '/auth/facebook/callback',
    REGISTER_NEW_USER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  USERAPI: {
    GET_CURRENTUSER: '/user/currentUser',
    PUT_UPDATE_PROFILE_DETAILS: '/user/updateProfileDetails',
    JOB_ROUTES: {
      myjobs: '/job/myjobs',
      alljobs: '/job/alljobs',
      postASearch: '/job/search',
    },
    BIDDER_ROUTES: {
      postABid: '/bids/post_a_bid',
      getAllMyBids: '/bids/get_all_my_bids',
    }
  }
};
export const FRONTENDROUTES = {
  ENTRY: '/',
  HOME: '/home',
  PROPOSER: {
    root: '/proposer',
    createjob: '/proposer/create-job',
    myjobs: '/proposer/my-jobs',
    currentPostedJob: '/job/current-posted-job'
  },
  BIDDER: {
    root: '/bidder',
    bidNow: '/bidder/bid-now',
    mybids: '/bidder/my-bids',
    currentPostedBid: '/bids/current-posted-bid'
  },
  MY_PROFILE: '/my-profile'
};
