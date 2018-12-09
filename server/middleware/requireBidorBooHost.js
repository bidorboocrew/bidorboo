const keys = require('../config/keys');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    next();
  } else if (req.hostname != keys.allowedHostName) {
    return res
      .status(401)
      .send({ errorMsg: 'You must Be on our secure site to perform this action.' });
  } else {
    next();
  }
};
