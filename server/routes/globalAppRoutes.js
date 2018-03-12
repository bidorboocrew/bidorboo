const passport = require('passport');
const bodyParser = require('body-parser');
// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const applicationDataAccess = require('../data-access/applicationDataAccess');
const ROUTES = require('../route_constants');
const requireAdmin = require('../middleware/requireAdmin');

module.exports = app => {
  // Special function to initialize our core schemas (APP WIDE global schemas)
  // app.get(
  //   ROUTES.APPAPI.INITIALIZE_APPLICATION_GLOBAL_SCHEMAS,
  //   requireAdmin,
  //   async (req, res, done) => {
  //     try {
  //       const initializingAppHealthModel = await applicationDataAccess.AppHealthModel.initialize();
  //       const initializingAppJobsModel = await applicationDataAccess.AppJobsModel.initialize();
  //       const initializingAppUsersModel = await applicationDataAccess.AppUsersModel.initialize();

  //       res.send({ details: 'operation succeeded' });
  //       done(null);
  //     } catch (e) {
  //       res.send({ details: e });
  //       done(null);
  //     }
  //   }
  // );
};
