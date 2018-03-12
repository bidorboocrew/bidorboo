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
  },
  APPAPI: {
    INITIALIZE_APPLICATION_GLOBAL_SCHEMAS: '/bdbApp/initializeAppGlobalSchemas',
  },
  FRONTEND: {
    ENTRY: '/',
    HOME: '/home',
    PROPOSER: '/proposer',
    BIDDER: '/bidder',
    MY_PROFILE: '/myprofile'
  }
};

