// to log our customer encountered  bugs
const mongoose = require('mongoose');
const keys = require('../config/keys');
// https://eng.datafox.com/mongoose/2017/02/22/what-we-wish-we-had-known-about-mongoose/
module.exports = (process) => {
  // require the application models
  require('../models/bidModel');
  require('../models/userModel');
  require('../models/reviewModel');
  require('../models/jobModel');
  require('../models/paymentModel');

  mongoose.Promise = global.Promise;
  if (process.env.NODE_ENV !== 'production') {
    // https://stackoverflow.com/questions/18762264/log-all-queries-that-mongoose-fire-in-the-application
    mongoose.set('debug', true);
  }
  const dbOptions = {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: 120,
    reconnectTries: 20, // Never stop trying to reconnect
    reconnectInterval: 5000, // Reconnect every 500ms,
    // config: { autoIndex: false }// avoid performance hit due to schema level indexing
  };

  mongoose.connect(keys.mongoURI, dbOptions, (err) => {
    if (err) {
      console.log(
        `Could not connect to mongodb on localhost.
        Ensure that you have mongodb running mongodb accepts connections on standard ports! errorMsg: ${err}`
      );
      throw err;
    }
  });

  mongoose.set('useFindAndModify', false);

  process.on('SIGINT', function() {
    console.log('=== safe shut down ==== bid or boo ');
    mongoose.connection.close(() => {
      console.log('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
    });
  });
};
