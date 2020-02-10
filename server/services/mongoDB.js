// to log our customer encountered  bugs
const mongoose = require('mongoose');
const keys = require('../config/keys');
// https://eng.datafox.com/mongoose/2017/02/22/what-we-wish-we-had-known-about-mongoose/
module.exports = (process) => {
  // require the application models
  require('../models/bidModel');
  require('../models/userModel');
  require('../models/reviewModel');
  require('../models/requestModel');
  // require('../models/paymentModel');

  mongoose.Promise = global.Promise;

  const dbOptions = {
    autoIndex: false,
    config: { autoIndex: true }, // avoid performance hit due to schema level indexing
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 12,
    keepAlive: true,
    useCreateIndex: true,
    autoCreate: true,
  };
  mongoose.set('debug', process.env.NODE_ENV === 'production' ? false : true);

  mongoose
    .connect(keys.mongoURI, dbOptions, (err) => {
      if (err) {
        console.log(
          `BIDORBOOLOGS======== Could not connect to mongodb on localhost.
        Ensure that you have mongodb running mongodb accepts connections on standard ports! errorMsg: ${err}`
        );
        throw err;
      }
    })
    .catch((error) => console.error(`BIDORBOOLOGS======== Mongoose Eror. ${error}`));

  mongoose.connection.on('error', (err) => {
    console.error(`BIDORBOOLOGS======== Mongoose Eror. ${err}`);
  });
  mongoose.set('useFindAndModify', false);

  process.on('SIGINT', function() {
    console.log('BIDORBOOLOGS======== safe shut down ==== bid or boo ');
    mongoose.connection.close(() => {
      console.log(
        'BIDORBOOLOGS======== Mongoose default connection is disconnected due to application termination'
      );
      process.exit(0);
    });
  });
};
