const { jobDataAccess } = require('../data-access/jobDataAccess');
const ROUTES = require('../backend-route-constants');
const utils = require('../utils/utilities');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');

module.exports = (app) => {
  app.get(ROUTES.API.JOB.GET.myOpenJobs, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      userJobsList = await jobDataAccess.getUserJobsByState(req.user.userId, 'OPEN');
      return res.send({ _postedJobsRef: userJobsList });
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get my open jobs', details: e });
    }
  });

  app.get(ROUTES.API.JOB.GET.jobById, requireLogin, async (req, res) => {
    try {
      if (req.query && req.query.jobId) {
        const { jobId } = req.query;
        const userId = req.user.userId;

        const jobDetails = await jobDataAccess.getMyPostedJobs(userId, jobId);
        return res.send(jobDetails);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request for get job by id, jobId param was Not Specified',
        });
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get job by id', details: e });
    }
  });

  app.get(ROUTES.API.JOB.GET.alljobsToBidOn, requireBidorBooHost, async (req, res) => {
    try {
      const userId = req.user && req.user.userId ? req.user.userId : null;
      const mongoDbUserId = req.user && req.user._id ? req.user._id : null;

      const isUserLoggedIn = !!(userId && mongoDbUserId);
      // userJobsList = isUserLoggedIn
      //   ? await jobDataAccess.getAllJobsToBidOnForLoggedInUser(userId, mongoDbUserId)
      //   : await jobDataAccess.getAllJobsToBidOnForLoggedOutUser();
      userJobsList = await jobDataAccess.getAllJobsToBidOnForLoggedOutUser();
      return res.send(userJobsList);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get all posted jobs', details: e });
    }
  });

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  app.delete(ROUTES.API.JOB.DELETE.jobById, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      const userId = req.user.userId;
      const jobId = req.body.jobId;

      if (jobId) {
        userJobsList = await jobDataAccess.deleteJob(jobId, userId);
        return res.send(jobId);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request JobId param was Not Specified',
        });
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To delete job', details: e });
    }
  });

  app.get(
    ROUTES.API.JOB.GET.jobFullDetailsById,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        if (req.query && req.query.jobId) {
          const { jobId } = req.query;
          jobFullDetails = await jobDataAccess.getAwardedJobDetails(jobId);
          return res.send(jobFullDetails);
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request for awarded job details, jobId param was Not Specified',
          });
        }
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To get my awarded jobs', details: e });
      }
    }
  );

  app.get(ROUTES.API.JOB.GET.myAwardedJobs, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      userJobsList = await jobDataAccess.getUserJobsByState(req.user.userId, 'AWARDED');
      return res.send({ _postedJobsRef: userJobsList });
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get my awarded jobs', details: e });
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
          return res.status(400).send({
            errorMsg: 'Bad Request JobId searchQuery params was Not Specified',
          });
        }

        let searchQuery = {
          searchLocation: searchParams.searchLocation,
          searchRaduisInMeters: searchParams.searchRaduis,
          jobTypeFilter: searchParams.jobTypeFilter,
        };

        existingJob = await jobDataAccess.getJobsNear(searchQuery);
        if (existingJob) {
          return res.send(existingJob);
        } else {
          return res.send({ errorMsg: 'JobId Was Not Specified' });
        }
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To perform the search', details: e });
      }
    }
  );

  app.post(ROUTES.API.JOB.POST.newJob, requireLogin, async (req, res) => {
    try {
      const { jobDetails } = req.body.data;
      const userMongoDBId = req.user._id;
      const newJob = await jobDataAccess.addAJob(jobDetails, userMongoDBId);

      return res.send(newJob);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To create new job', details: e });
    }
  });
  app.put(ROUTES.API.JOB.PUT.jobImage, requireLogin, async (req, res) => {
    try {
      const filesList = req.files;
      // create new job for this user
      const jobId = req.body.jobId;
      const userMongoDBId = req.user._id;
      let cloudinaryHostedImageObj = [];
      const callbackFunc = (error, result) => {
        // update the user data model
        if (result) {
          const { secure_url, public_id } = result;
          cloudinaryHostedImageObj.push({ secure_url, public_id });
        }
      };

      if (filesList && filesList.length > 0) {
        const cloudinaryUploadReqs = [];
        filesList.forEach((file) => {
          cloudinaryUploadReqs.push(
            utils.uploadFileToCloudinary(
              file.path,
              {
                folder: `${userMongoDBId}/${jobId}`,
              },
              callbackFunc
            )
          );
        });
        const uploadImages = await Promise.all(cloudinaryUploadReqs);

        if (jobId && cloudinaryHostedImageObj.length > 0) {
          jobDataAccess.addJobImages(jobId, cloudinaryHostedImageObj);
        }
        res.send({
          success: true,
          jobId: jobId,
        });
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To upload job image', details: e });
    }
  });

  app.put(ROUTES.API.JOB.PUT.awardBidder, requireLogin, async (req, res) => {
    try {
      // create new job for this user
      const data = req.body.data;
      // const userId = req.user.userId;
      // const userMongoDBId = req.user._id;

      const { jobId, bidId } = data;
      let existingJob = null;

      existingJob = await jobDataAccess.awardedBidder(jobId, bidId);
      if (existingJob) {
        return res.send(existingJob);
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To award bidder', details: e });
    }
  });
};
