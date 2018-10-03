const keys = require('../config/keys');

module.exports = (req, res, next) => {
  if (req.hostname != keys.allowedHostName) {
    return res
      .status(401)
      .send({ errorMsg: 'You must Be Logged in to perform this action.' });
  }
  next();
};
