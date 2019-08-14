const express = require('express');
const passport = require('passport');
const path = require('path');

const keys = require('./config/keys');

let bugsnagMiddleware = null;
if (process.env.NODE_ENV === 'production') {
  // initialize bugsnag
  const bugsnag = require('@bugsnag/js');
  const bugsnagExpress = require('@bugsnag/plugin-express');
  const bugsnagClient = bugsnag(keys.bugSnagApiKey);
  bugsnagClient.use(bugsnagExpress);
  const middleware = bugsnagClient.getPlugin('express');
}
// initialize and start mongodb
require('./services/mongoDB')(process);
require('./services/passport');

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT);

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

// Automated tasks
require('./services/CronRepeatingJobs')(app);

// instantiate passport
app.use(passport.initialize());
app.use(passport.session());

// instantiate app routes
require('./services/populateAppRoutes')(app);

// error handling
app.use((err, req, res, next) => {
  console.log('BIDORBOOLOGS ======== error handler BEGIN==========');
  console.error(err); // Log error message in our server's console

  if (!err.statusCode) {
    err.statusCode = 400;
  } // If err has no specified error code, set error code to 'Internal Server Error (500)'

  if (!err.safeMsg) {
    err.safeMsg =
      "Sorry, something didn't work. Try again or chat with us using the chat bottom in the footer of this page.";
  }
  console.log('BIDORBOOLOGS ======== error handler END ==========');

  res.status(err.statusCode).send(err.safeMsg); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

if (process.env.NODE_ENV === 'production') {
  app.use(bugsnagMiddleware.errorHandler);
}
// serve the static js file
if (process.env.NODE_ENV === 'production') {
  console.log('IAM NODE process.env.NODE_APP_INSTANCE ' + process.env.NODE_APP_INSTANCE);
  // xxx not sure about this . I may remove
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
