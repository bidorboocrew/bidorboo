const keys = require('../config/keys');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    next();
  } else if (keys.allowedHostName === req.hostname) {
    return res.status(401).send('Navigate to BidOrBoo official secure site https://www.bidorboo.ca');
  } else {
    next();
  }
};
