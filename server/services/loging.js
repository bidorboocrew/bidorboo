// for logs
const morganBody = require('morgan-body');

module.exports = app => {
  // to log bugs into bugsnag
  morganBody(app);

};
