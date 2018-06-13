//prod key

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.mongoURI,
  cookieKey: process.env.COOKIE_KEY_ONE,
  cookieKey2: process.env.COOKIE_KEY_TWO,
  facebookClientID: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  allowedHostName: process.env.ALLOWED_HOST_NAME,
  bugSnagApiKey: process.env.BUGSNAG_API_KEY
};
