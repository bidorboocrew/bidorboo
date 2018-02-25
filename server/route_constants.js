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
  },
  FRONTEND: {
    ENTRY: '/',
    HOME: '/home',
    PROPOSER: '/proposer',
    BIDDER: '/bidder',
    MY_PROFILE: '/myprofile'
  }
};

