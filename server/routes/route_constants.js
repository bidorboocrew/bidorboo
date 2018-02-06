//any changes to these routes will need to be reflected on the front end
module.exports = {
  ENTRY: '/',
  AUTH: {
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FACEBOOK: '/auth/facebook',
    FACEBOOK_CALLBACK: '/auth/facebook/callback'
  },
  API: {
    GET_CURRENTUSER: '/api/currentUser',
    LOGOUT: '/api/logout'
  },
  FRONTEND: {}
};
