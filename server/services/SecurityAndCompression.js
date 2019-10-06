const compression = require('compression');
const helmet = require('helmet');
const csp = require('express-csp-header');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const keys = require('../config/keys');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
module.exports = (app) => {
  // security
  const cspMiddleware = csp({
    policies: {
      // xxxxxx do not release without understanding this
      // 'default-src': [csp.SELF],
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
    max: 50,
    windowMs: 1 * 60 * 1000,
  });

  //  apply to all requests
  process.env.NODE_ENV === 'production' && app.use(limiter);
  // https://github.com/SegFaultx64/express-http-to-https#readme
  // Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
  process.env.NODE_ENV === 'production' && app.use(redirectToHTTPS([/localhost:(\d{4})/]));
};
