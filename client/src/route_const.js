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
  },
};
export const FRONTENDROUTES = {
  ENTRY: '/',
  HOME: '/home',
  PROPOSER: '/proposer',
  BIDDER: '/bidder',
  MY_PROFILE: '/myprofile'
};
