// to log our customer encountered  bugs
const mongoose = require('mongoose');
const keys = require('../config/keys');

module.exports = (process) => {
  // require the application models
  require('../models/bidModel');
  require('../models/applicationGlobalModels');
  require('../models/userModel');
  require('../models/reviewModel');
  require('../models/jobModel');
  require('../services/passport');

  mongoose.Promise = global.Promise;

  const dbOptions = {
    keepAlive: 120,
    reconnectTries: 20, // Never stop trying to reconnect
    reconnectInterval: 5000 // Reconnect every 500ms,
    // config: { autoIndex: false }// avoid performance hit due to schema level indexing
  };

  mongoose.connect(
    keys.mongoURI,
    dbOptions,
    err => {
      if (err) {
        console.log(
          `Could not connect to mongodb on localhost.
        Ensure that you have mongodb running mongodb accepts connections on standard ports! errorMsg: ${err}`
        );
        throw err;
      }
    }
  );

  process.on('SIGINT', function() {
    console.log('=== safe shut down ==== bid or boo ');
    mongoose.connection.close(() => {
      console.log(
        'Mongoose default connection is disconnected due to application termination'
      );
      process.exit(0);
    });
  });
};
