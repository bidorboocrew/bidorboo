const keys = require('../config/keys');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    next();
  } else if (keys.allowedHostNames.indexOf(req.hostname) > -1) {
    return res.status(401).send('Navigate to our official secure site  https://www.bidorboo.ca');
  } else {
    next();
  }
};
