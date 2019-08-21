// to log our customer encountered  bugs
const mongoose = require('mongoose');
const keys = require('../config/keys');
// https://eng.datafox.com/mongoose/2017/02/22/what-we-wish-we-had-known-about-mongoose/
before((done) => {
  // require the application models
  require('../models/bidModel');
  require('../models/userModel');
  require('../models/reviewModel');
  require('../models/jobModel');
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

  mongoose.connect(keys.mongoURI, dbOptions);
  mongoose.connection
    .once('open', () => {
      done();
    })
    .on('error', (error) => {
      console.warn('Warning', error);
    });

  mongoose.set('useFindAndModify', false);

  process.on('SIGINT', function() {
    console.log('BIDORBOO=== safe shut down ==== bid or boo ');
    mongoose.connection.close(() => {
      console.log(
        'BIDORBOO=== Mongoose default connection is disconnected due to application termination'
      );
      process.exit(0);
    });
  });
});

after((done) => {
  mongoose.connection.close(() => {
    console.log(
      'BIDORBOO=== Mongoose default connection is disconnected due to application termination'
    );
    process.exit(0);
    done();
  });
});
