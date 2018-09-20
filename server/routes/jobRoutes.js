const { jobDataAccess } = require('../data-access/jobDataAccess');
const ROUTES = require('../backend_route_constants');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const isJobOwner = require('../middleware/isJobOwner');
const multiparty = require('multiparty');
const cloudinary = require('cloudinary');
const fs = require('fs');
var formidable = require('formidable');
var multer = require('multer');

module.exports = app => {
  app.get(
    ROUTES.USERAPI.JOB_ROUTES.myjobs,
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

  app.get(
    ROUTES.USERAPI.JOB_ROUTES.alljobs,
    requireBidorBooHost,
    async (req, res) => {
      try {
        userJobsList = await jobDataAccess.getAllPostedJobs();
        res.send(userJobsList);
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

  app.post(
    `${ROUTES.USERAPI.JOB_ROUTES.postASearch}`,
    requireBidorBooHost,
    requireLogin,
    async (req, res, done) => {
      try {
        const searchParams = req.body.data.searchParams;
        if (!searchParams) {
          return res.send({ Error: 'JobId search params were Not Specified' });
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

  app.get(
    `${ROUTES.USERAPI.JOB_ROUTES}/:jobId`,
    requireLogin,
    async (req, res, done) => {
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

        done(null, existingJob);
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

  app.post(ROUTES.USERAPI.JOB_ROUTES.myjobs, requireLogin, async (req, res) => {
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
  app.post(
    ROUTES.USERAPI.JOB_ROUTES.uploadImage,
    requireLogin,
    async (req, res) => {
      try {
        const filesList = req.files;
        // create new job for this user
        const data = req.body.data;
        const userId = req.user.userId;
        const userMongoDBId = req.user._id;
        await cloudinary.v2.uploader.upload(
          filesList[0].path,
          (error, result) => {
            return res.send({
              error: 'error uploading ' + error,
              result: result
            });
          }
        );

        return res.send({ msg: 'file uploaded successfully' });
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );

  app.put(
    ROUTES.USERAPI.JOB_ROUTES,
    requireLogin,
    isJobOwner,
    async (req, res) => {
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
        return res.send(newJob);
      } catch (e) {
        res.status(500).send({ error: 'Sorry Something went wrong \n' + e });
      }
    }
  );
};
