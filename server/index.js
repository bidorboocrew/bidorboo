const express = require('express');
const passport = require('passport');
const path = require('path');
const expressip = require('express-ip');
const responseTime = require('response-time');
const errorhandler = require('errorhandler');

const keys = require('./config/keys');
// const { errors } = require('celebrate');

// initialize bugsnag
const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const bugsnagClient = bugsnag(keys.bugSnagApiKey);
let bugsnagMiddleware;
if (process.env.NODE_ENV === 'production') {
  bugsnagClient.use(bugsnagExpress);
  bugsnagMiddleware = bugsnagClient.getPlugin('express');
}
// initialize and start mongodb
require('./services/mongoDB')(process);
require('./services/passport');

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT);
app.use(responseTime());

app.use(expressip().getIpInfoMiddleware);

if (process.env.NODE_ENV === 'production') {
  app.use(bugsnagMiddleware.requestHandler);
}
// initialize bugsnag
// require('./services/bugSnag')(app);
// initialize security and compression
require('./services/SecurityAndCompression')(app);
// initialize logging
require('./services/loging')(app, process);

// file uploader service cloudinary + multer middleware
require('./services/cloudinaryAndMulterFileUploader')(app);

// initialize cookie session and body parser
require('./services/cookieSessionAndParser')(app);

// instantiate passport
app.use(passport.initialize());
app.use(passport.session());

// instantiate app routes
require('./services/populateAppRoutes')(app);
require('./services/CronRepeatingJobs')(app);

// error handling
app.use((err, req, res, next) => {
  console.log('BIDORBOOLOGS ======== error handler BEGIN==========');
  console.log(err); // Log error message in our server's console
  if (err.joi) {
    return res.status(400).send({ safeMsg: err.joi.message });
  }

  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      err.safeMsg = err.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case 'StripeInvalidRequestError':
      err.safeMsg = "Invalid parameters were supplied to Stripe's API";
      // Invalid parameters were supplied to Stripe's API
      break;
    case 'StripeAPIError':
      err.safeMsg = "An error occurred internally with Stripe's API";
      // An error occurred internally with Stripe's API
      break;
    case 'StripeConnectionError':
      err.safeMsg = 'Some kind of error occurred during the HTTPS communication';
      // Some kind of error occurred during the HTTPS communication
      break;
    case 'StripeAuthenticationError':
      err.safeMsg = 'Stripe Auth Error';
      // You probably used an incorrect API key
      break;
    case 'StripeRateLimitError':
      err.safeMsg = 'Stripe Too many requests hit the API too quickly';
      // Too many requests hit the API too quickly
      break;
    case 'StripePermissionError':
      err.safeMsg = 'Stripe Access to a resource is not allowed';

      // Access to a resource is not allowed
      break;
    case 'StripeIdempotencyError':
      err.safeMsg = 'Stripe An idempotency key was used improperly';

      // An idempotency key was used improperly
      break;
    case 'StripeInvalidGrantError':
      // InvalidGrantError is raised when a specified code doesn't exist, is
      // expired, has been used, or doesn't belong to you; a refresh token doesn't
      // exist, or doesn't belong to you; or if an API key's mode (live or test)
      // doesn't match the mode of a code or refresh token.
      break;
  }

  if (!err.statusCode) {
    err.statusCode = 400;
  } // If err has no specified error code, set error code to 'Internal Server Error (500)'
  if (err.message) {
    err.safeMsg = err.safeMsg || err.message;
  }
  if (!err.safeMsg) {
    err.safeMsg =
      "Sorry, something didn't work. Try again or chat with us using the chat bottom in the footer of this page.";
  }
  console.log('BIDORBOOLOGS ======== error handler END ==========');

  res.status(err.statusCode).send(err.safeMsg); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler());
}
if (process.env.NODE_ENV === 'production') {
  app.use(bugsnagMiddleware.errorHandler);
}
// serve the static js file
if (process.env.NODE_ENV === 'production') {
  console.log('IAM NODE process.env.NODE_APP_INSTANCE ' + process.env.NODE_APP_INSTANCE);

  // app.use(redirectToHTTPS());

  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('../client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get('/*', (req, res) => {
    console.log('serving dirname ' + path.resolve(__dirname, '../client', './build', 'index.html'));
    res.sendFile(path.resolve(__dirname, '../client', './build', 'index.html'));
  });
}
