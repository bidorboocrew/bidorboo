// for logs
const morganBody = require('morgan-body');
const morgan = require('morgan');

module.exports = (app, process) => {
  app.use(morgan('dev'));
  morganBody(app, { maxBodyLength: 1000 });

  process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(
      '------------------------------------  uncaughtException ERROR  -----------------------'
    );
    console.log(err);
    console.log(
      '------------------------------------^^ uncaughtException ERROR ^^-----------------------'
    );
  });
  process.on('unhandledRejection', function(reason, p) {
    console.log(
      '------------------------------------  unhandledRejection ERROR  -----------------------'
    );
    console.log(
      'Possibly Unhandled Rejection at: Promise ',
      p,
      ' reason: ',
      reason
    );
    console.log(
      '------------------------------------^^ unhandledRejection ERROR ^^-----------------------'
    );
  });
};
