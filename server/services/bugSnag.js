// to log our customer encountered  bugs

const keys = require('../config/keys');
const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');

const bugsnagClient = bugsnag(keys.bugSnagApiKey);
bugsnagClient.use(bugsnagExpress);
const middleware = bugsnagClient.getPlugin('express');

module.exports = (app) => {
  // to log bugs into bugsnag

  app.use(middleware.requestHandler);
  app.use(middleware.errorHandler);
};
