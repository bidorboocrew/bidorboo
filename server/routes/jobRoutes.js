const { jobDataAccess } = require('../data-access/jobDataAccess');
const ROUTES = require('../backend_route_constants');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const isJobOwner = require('../middleware/isJobOwner');

module.exports = app => {
  app.get(
    ROUTES.USERAPI.JOB_ROUTES.myjobs,
    requireBidorBooHost,
    requireLogin,
    async (req, res, done) => {
      try {
        userJobsList = await jobDataAccess.getAllJobsForUser(req.user.userId);
        res.send(userJobsList);
      } catch (e) {
        res.status(500).send({ error: "Sorry Something went wrong \n" +e })
      }
    }
  );

  app.get(
    ROUTES.USERAPI.JOB_ROUTES.alljobs,
    requireBidorBooHost,
    requireLogin,
    async (req, res, done) => {
      try {
        userJobsList = await jobDataAccess.getAllPostedJobs();
        res.send(userJobsList);
      } catch (e) {
        res.status(500).send({ error: "Sorry Something went wrong \n" +e })
      }
    }
  );



  app.get(
    `${ROUTES.USERAPI.JOB_ROUTES}/:jobId`,
    requireLogin,
    async (req, res, done) => {
      try {
        const requestedJobId = req.params.jobId;
        if (!requestedJobId) {
          res.send({ Error: 'JobId Was Not Specified' });
          done(null, null);
        }

        let existingJob = null;

        existingJob = await jobDataAccess.findOneByJobId(requestedJobId);
        if (existingJob) {
          res.send(existingJob);
        } else {
          res.send({ Error: 'JobId Was Not Specified' });
        }

        done(null, existingJob);
      } catch (e) {
        res.status(500).send({ error: "Sorry Something went wrong \n" +e })
        done(e, null);
      }
    }
  );

  app.post(ROUTES.USERAPI.JOB_ROUTES.myjobs, requireLogin, async (req, res, done) => {
    try {
      // create new job for this user
      const data = req.body.data;
      const userId = req.user.userId;
      const userMongoDBId = req.user._id;
      const newJob = await jobDataAccess.addAJob({
        ...data.jobDetails,
        _ownerId: userMongoDBId
      },userId);
      res.send(newJob);
      done(null, newJob);
    } catch (e) {
      res.status(500).send({ error: "Sorry Something went wrong \n" +e })
    }
  });

  app.put(
    ROUTES.USERAPI.JOB_ROUTES,
    requireLogin,
    isJobOwner,
    async (req, res, done) => {
      // you must ensure that they are the owners before allowing them to modify an existing job
      try {
        // create new job for this user
        const { jobIdToUpdate, ...newJobDetails } = req.body.data;
        const userId = req.user._id;
        const options = {
          new: true
        };
        const newJob = await jobDataAccess.findOneByJobIdAndUpdateJobInfo(
          jobIdToUpdate,
          newJobDetails,
          options
        );
        res.send(newJob);
        done(null, newJob);
      } catch (e) {
        res.status(500).send({ error: "Sorry Something went wrong \n" +e })
      }
    }
  );
};
