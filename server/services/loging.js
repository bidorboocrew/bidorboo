// for logs
const morganBody = require('morgan-body');

module.exports = app => {
  morganBody(app);
};
