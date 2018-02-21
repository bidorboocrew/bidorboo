const express = require('express');
const mongoose = require('mongoose');

const expressLogging = require('express-logging');
const logger = require('logops');
// const logger = require('morgan'); //ToDO questionable if I should use this or something else
// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');

const keys = require('./config/keys');

const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

require('./models/userModel');
require('./services/passport');

mongoose.Promise = global.Promise;

const dbOptions = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 5, // Never stop trying to reconnect
  reconnectInterval: 500 // Reconnect every 500ms
};
mongoose.connect(keys.mongoURI, dbOptions, err => {
  if (err) {
    console.log(
      'Could not connect to mongodb on localhost. Ensure that you have mongodb running mongodb accepts connections on standard ports!'
    );
  }
});

const app = express();

// security package
app.use(helmet());
app.disable('x-powered-by');
// app.use(logger('dev'));
app.use(expressLogging(logger));

//https://github.com/expressjs/cookie-session
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send({ body: 'hello' });
});

app.post('/errorRoute', (req, res) => {
  res.send({ body: 'error' });
});

//hyrdrate the routes with the app
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // xxx not sure about this . I may remove
  app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] != 'https')
      res.redirect(['https://', req.get('Host'), req.url].join(''));
    else next();
  });

  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('../client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    console.log(
      'dirname ' + path.resolve(__dirname, '../client', './build', 'index.html')
    );
    res.sendFile(path.resolve(__dirname, '../client', './build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
