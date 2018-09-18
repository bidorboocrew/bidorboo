// to log our customer encountered  bugs
const bugsnag = require('bugsnag');
const keys = require('../config/keys');

module.exports = app => {
  // to log bugs into bugsnag
  bugsnag.register(keys.bugSnagApiKey);
  app.use(bugsnag.requestHandler);
  app.use(bugsnag.errorHandler);
};
