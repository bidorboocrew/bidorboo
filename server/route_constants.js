//any changes to these routes will need to be reflected on the front end
module.exports = {
  ENTRY: '/',
  AUTH: {
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FACEBOOK: '/auth/facebook',
    FACEBOOK_CALLBACK: '/auth/facebook/callback'
  },
  USERAPI: {
    GET_CURRENTUSER: '/user/currentUser',
    LOGOUT: '/user/logout'
  },

  FRONTEND: {
    ENTRY: '/',
    HOME:'/home',
    PROPOSER: '/proposer',
    BIDDER: '/bidder',
    MY_PROFILE: '/myprofile'
  }
};
