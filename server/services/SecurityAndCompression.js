const compression = require('compression');
const helmet = require('helmet');
const csp = require('express-csp-header');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const keys = require('../config/keys');

module.exports = (app) => {
  // security
  const cspMiddleware = csp({
    policies: {
      'block-all-mixed-content': true,
    },
  });
  app.use(cspMiddleware);

  // security package
  app.use(helmet({ xssFilter: false }));
  app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

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
      },
    })
  );
  // https://www.npmjs.com/package/rate-limit-mongo
  const limiter = new RateLimit({
    store: new MongoStore({
      // see Configuration
      uri: keys.mongoURI,
    }),
    max: 100,
    windowMs: 15 * 60 * 1000,
  });

  //  apply to all requests
  app.use(limiter);
};
