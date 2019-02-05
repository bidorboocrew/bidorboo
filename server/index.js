const express = require('express');
const passport = require('passport');
const path = require('path');
const errorHandler = require('errorhandler');

// initialize and start mongodb
require('./services/mongoDB')(process);
require('./services/passport');

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT);

if (process.env.NODE_ENV !== 'production') {
  app.use(errorHandler());
}

// initialize bugsnag
if (process.env.NODE_ENV === 'production') {
  require('./services/bugSnag')(app);
}
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
