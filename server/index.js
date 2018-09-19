const express = require('express');
const passport = require('passport');
const corsPrefetch = require('cors-prefetch-middleware').default;
const path = require('path');

const multer = require('multer');
var upload = multer({  dest: path.resolve(__dirname, '../uploadsTempDir') })


// initialize and start mongodb
require('./services/mongoDB')(process);

const app = express();

app.use(upload.array('filesToUpload'));

// allow file upload
app.use(corsPrefetch);

// initialize bugsnag
require('./services/bugSnag')(app);

// initialize security and compression
require('./services/SecurityAndCompression')(app);

// initialize logging
require('./services/loging')(app);

// file uploader service cloudinary
require('./services/cloudinaryFileUploader')();

// initialize cookie session and body parser
require('./services/cookieSessionAndParser')(app);

// instantiate passport
app.use(passport.initialize());
app.use(passport.session());

// instantiate app routes
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/jobRoutes')(app);
require('./routes/bidderRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // xxx not sure about this . I may remove
  // app.use(redirectToHTTPS());

  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('../client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get('/*', (req, res) => {
    console.log(
      'serving dirname ' +
        path.resolve(__dirname, '../client', './build', 'index.html')
    );
    res.sendFile(path.resolve(__dirname, '../client', './build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
