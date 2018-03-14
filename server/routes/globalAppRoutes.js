


const applicationDataAccess = require('../data-access/applicationDataAccess');
const {jobDataAccess} = require('../data-access/jobDataAccess');

const requireAdmin = require('../middleware/requireAdmin');

module.exports = app => {
  // Special function to initialize our core schemas (APP WIDE global schemas)
  // app.get(
  //   '/bdbApp/initializeAppGlobalSchemas',
  //   requireAdmin,
  //   async (req, res, done) => {
  //     try {
  //       const initializingAppHealthModel = await applicationDataAccess.AppHealthModel.initialize();
  //       const initializingAppJobsModel = await applicationDataAccess.AppJobsModel.initialize();
  //       const initializingAppUsersModel = await applicationDataAccess.AppUsersModel.initialize();

  //       res.send({ details: 'populated base models for your entire app succeeded' });
  //       done(null);
  //     } catch (e) {
  //       res.send({ details: e });
  //       done(null);
  //     }
  //   }
  // );

  app.get('/bdbApp/populatejob', requireAdmin, async (req, res, done) => {
    try {
      const initializeJobModel = await jobDataAccess.addAJob('d');

      res.send({ details: 'added fake job succeeded \n '+JSON.stringify(initializeJobModel) });
      done(null);
    } catch (e) {
      res.send({ details: e });
      done(null);
    }
  });
};
