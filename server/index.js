const express = require('express');
const mongoose = require('mongoose');
const morganBody = require('morgan-body');

const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const csp = require('express-csp-header');
// const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;


const keys = require('./config/keys');

require('./models/userModel');
require('./services/passport');

mongoose.Promise = global.Promise;

const dbOptions = {
  keepAlive: 120,
  reconnectTries: 20, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  autoIndex: false // avoid performance hit due to schema level indexing
};
mongoose.connect(keys.mongoURI, dbOptions, err => {
  if (err) {
    console.log(
      `Could not connect to mongodb on localhost.
      Ensure that you have mongodb running mongodb accepts connections on standard ports! error: ${err}`
    );
  }
});

const app = express();

const cspMiddleware = csp({
  policies: {
    'block-all-mixed-content': true
  }
});

// security package
app.use(
  helmet({
    frameguard: {
      action: 'deny'
    }
  })
);
app.use(helmet.hidePoweredBy());
app.use(cspMiddleware);
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
morganBody(app);

//https://github.com/expressjs/cookie-session
const expiryDate = 10 * 24 *60 * 60 * 1000; //10 days
app.use(
  cookieSession({
    maxAge: expiryDate, // 1hour
    keys: [keys.cookieKey, keys.cookieKey2],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'bidorboo.com',
      expires: expiryDate
    }
  })
);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

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



// define app routes
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);



const PORT = process.env.PORT || 5000;
app.listen(PORT);
