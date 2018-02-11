//MAKE SURE THIS IS IN SYNC WITH server\routes\ROUTE_CONSTANTS
export const BACKENDROUTES = {
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
  }
};
export const FRONTENDROUTES = {
  ENTRY: '/',
  LOGIN: '/login',
  PROPOSER: '/proposer',
  BIDDER: '/bidder',
  MY_PROFILE: '/myprofile'
};
