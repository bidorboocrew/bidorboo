const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');

const morganBody = require('morgan-body');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const csp = require('express-csp-header');

const keys = require('./config/keys');

require('./models/bidModel');
require('./models/applicationGlobalModels');
require('./models/userModel');
require('./models/reviewModel');
require('./models/jobModel');
require('./services/passport');

mongoose.Promise = global.Promise;

const dbOptions = {
  keepAlive: 120,
  reconnectTries: 20, // Never stop trying to reconnect
  reconnectInterval: 5000 // Reconnect every 500ms
};
// autoIndex: false // avoid performance hit due to schema level indexing



const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [new transports.Console()]
})

mongoose.connect(keys.mongoURI, dbOptions, err => {
  if (err) {
    console.log(
      `Could not connect to mongodb on localhost.
      Ensure that you have mongodb running mongodb accepts connections on standard ports! error: ${err}`
    );
  }
});

const app = express();

// performance
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
      }
      // fallback to standard filter function
      return compression.filter(req, res);
    }
  })
);

const cspMiddleware = csp({
  policies: {
    'block-all-mixed-content': true
  }
});
app.use(cspMiddleware);

// security package
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
morganBody(app);

//https://github.com/expressjs/cookie-session
const expiryDate = 24 * 60 * 60 * 1000; //10 days
app.use(
  cookieSession({
    maxAge: expiryDate, // 24 hours
    keys: [keys.cookieKey, keys.cookieKey2],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'bidorboo.com',
      expires: new Date(Date.now() + expiryDate) // 1 hour
    }
  })
);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

// define app routes
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/zzzzzzzzzzzzzzzzzzz')(app,logger);
require('./routes/jobRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // xxx not sure about this . I may remove
  // app.use(redirectToHTTPS());

  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('../client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    console.log(
      'serving dirname ' +
        path.resolve(__dirname, '../client', './build', 'index.html')
    );
    res.sendFile(path.resolve(__dirname, '../client', './build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);

process.on('SIGINT', function() {
  mongoose.connection.close(() => {
    console.log(
      'Mongoose default connection is disconnected due to application termination'
    );
    //XXXXXX add more logic to show site is under maintainance  banner if this happen
    process.exit(0);
  });
});
