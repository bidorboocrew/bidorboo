//any changes to these routes will need to be reflected on the front end
module.exports = {
  ENTRY: '/',
  AUTH: {
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FACEBOOK: '/auth/facebook',
    FACEBOOK_CALLBACK: '/auth/facebook/callback',
    LOGOUT: '/auth/logout',
  },
  USERAPI: {
    GET_CURRENTUSER: '/user/currentUser',
    PUT_UPDATE_PROFILE_DETAILS: '/user/updateProfileDetails',
    JOB_ROUTES: '/job'
  },
  FRONTEND: {
    ENTRY: '/',
    HOME: '/home',
    MY_PROFILE: '/myprofile',
    PROPOSER: {
      root: '/proposer',
      createjob: '/proposer/createjob',
      myjobs: '/proposer/myjobs'
    },
    BIDDER:  {
      root: '/bidder',
      createbid: '/bidder/createbid',
      mybids: '/bidder/mybids'
    },
  }
};


