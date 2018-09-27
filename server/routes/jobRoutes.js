const { jobDataAccess } = require('../data-access/jobDataAccess');
const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const isJobOwner = require('../middleware/isJobOwner');

const utils = require('../utils/utilities');

module.exports = app => {
  app.get(
    ROUTES.API.JOB.GET.myjobs,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        userJobsList = await jobDataAccess.getAllJobsForUser(req.user.userId);
        res.send(userJobsList);
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

  app.get(ROUTES.API.JOB.GET.alljobs, requireBidorBooHost, async (req, res) => {
    try {
      userJobsList = await jobDataAccess.getAllPostedJobs();
      res.send(userJobsList);
    } catch (e) {
      res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
    }
  });

  app.post(
    ROUTES.API.JOB.POST.searchJobs,
    requireBidorBooHost,
    requireLogin,
    async (req, res, done) => {
      try {
        const { searchParams } = req.body.data;
        if (!searchParams) {
          return res.status(400).send('Bad Request JobId searchQuery params was Not Specified')
          // return res.send({ Error: 'JobId search params were Not Specified' });
        }

        let searchQuery = {
          searchLocation: searchParams.searchLocation,
          searchRaduisInMeters: searchParams.searchRaduis,
          jobTypeFilter: searchParams.jobTypeFilter
        };

        existingJob = await jobDataAccess.getJobsNear(searchQuery);
        if (existingJob) {
          return res.send(existingJob);
        } else {
          return res.send({ Error: 'JobId Was Not Specified' });
        }
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

  app.get(ROUTES.API.JOB.GET.jobById, requireLogin, async (req, res, done) => {
    try {
      const requestedJobId = req.params.jobId;
      if (!requestedJobId) {
        return res.send({ Error: 'JobId Was Not Specified' });
      }

      let existingJob = null;

      existingJob = await jobDataAccess.findOneByJobId(requestedJobId);
      if (existingJob) {
        return res.send(existingJob);
      } else {
        return res.send({ Error: 'JobId Was Not Specified' });
      }
    } catch (e) {
      res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
    }
  });

  app.post(ROUTES.API.JOB.POST.newJob, requireLogin, async (req, res) => {
    try {
      // create new job for this user
      const data = req.body.data;
      const userId = req.user.userId;
      const userMongoDBId = req.user._id;
      const newJob = await jobDataAccess.addAJob(
        {
          ...data.jobDetails,
          _ownerId: userMongoDBId
        },
        userId
      );
      res.send(newJob);
    } catch (e) {
      res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
    }
  });

  app.put(ROUTES.API.JOB.PUT.jobImage, requireLogin, async (req, res) => {
    try {
      const filesList = req.files;
      // create new job for this user
      const data = req.body.data;
      const userId = req.user.userId;
      const userMongoDBId = req.user._id;

      const callbackFunc = (error, result) => {
        return res.send({
          error: error,
          result: result ? result.secure_url : {}
        });
      };

      await utils.uploadFileToCloudinary(filesList[0].path, callbackFunc);
    } catch (e) {
      res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
    }
  });
};
