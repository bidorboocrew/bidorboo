// for logs
const morganBody = require('morgan-body');
const morgan = require('morgan');

module.exports = (app, process) => {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { immediate: true }));
  morganBody(app, {
    maxBodyLength: 500,
    prettify: true,
    logRequestBody: true,
    logResponseBody: true,
    theme: 'dracula',
    logReqDateTime: true,
    logReqUserAgent: true,
  });

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
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    console.log(
      '------------------------------------^^ unhandledRejection ERROR ^^-----------------------'
    );
  });
};
