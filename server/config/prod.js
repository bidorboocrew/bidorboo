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
  bugSnagApiKey: process.env.BUGSNAG_API_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  sendGridKey: process.env.SEND_GRID_KEY,
  cloudinaryURL: process.env.CLOUDINARY_URL,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryPublicApiKey: process.env.CLOUDINARY_PUBLIC_API_KEY,
  cloudinarySecretApiKey: process.env.CLOUDINARY_SECRET_API_KEY,
  blowerText: process.env.BLOWERIO_URL,
  vapidPublicApiKey: process.env.VAPID_PUBLIC_API_KEY,
  vapidPrivateApiKey: process.env.VAPID_PRIVATE_API_KEY,
  recaptchaApiKey: process.env.RECAPTCHA_PRIVATE_API_KEY,
};
