// to log our customer encountered  bugs
const mongoose = require('mongoose');
const keys = require('../config/keys');
// https://eng.datafox.com/mongoose/2017/02/22/what-we-wish-we-had-known-about-mongoose/
// require the application models
require('../models/bidModel');
require('../models/userModel');
require('../models/reviewModel');
require('../models/requestModel');
// require('../models/paymentModel');

mongoose.Promise = global.Promise;

const dbOptions = {
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
  keepAlive: 120,
  reconnectTries: 20, // Never stop trying to reconnect
  reconnectInterval: 5000, // Reconnect every 500ms,
  // config: { autoIndex: false }// avoid performance hit due to schema level indexing
};

before((done) => {
  mongoose.connect(keys.mongoURI_dev, dbOptions);
  mongoose.connection
    .once('open', () => {
      console.log('open mongo connection stuff');
      done();
    })
    .on('error', (error) => {
      console.warn('Warning', error);
    });

  mongoose.set('useFindAndModify', false);

  process.on('SIGINT', function() {
    console.log('BidOrBoo=== safe shut down ==== bid or boo ');
    mongoose.connection.close(() => {
      console.log(
        'BidOrBoo=== Mongoose default connection is disconnected due to application termination'
      );
      process.exit(0);
      done();
    });
  });
});

after((done) => {
  mongoose.connection.close(() => {
    console.log(
      'BidOrBoo=== Mongoose default connection is disconnected due to application termination'
    );

    process.exit(0);
  });
});
