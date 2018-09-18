const compression = require('compression');
const helmet = require('helmet');
const csp = require('express-csp-header');

module.exports = app => {
  // security
  const cspMiddleware = csp({
    policies: {
      'block-all-mixed-content': true
    }
  });
  app.use(cspMiddleware);

  // security package
  app.use(helmet());
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
      }
    })
  );
};
