const { jobDataAccess } = require('../data-access/jobDataAccess');
const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const isJobOwner = require('../middleware/isJobOwner');

const utils = require('../utils/utilities');

module.exports = (app) => {
  app.get(ROUTES.API.JOB.GET.myjobs, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      userJobsList = await jobDataAccess.getAllJobsForUser(req.user.userId);
      return res.send(userJobsList);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get my jobs', details: e });
    }
  });

  app.get(ROUTES.API.JOB.GET.alljobs, requireBidorBooHost, async (req, res) => {
    try {
      const userMongoDBId = req.user.userId;

      userJobsList = await jobDataAccess.getAllPostedJobs(userMongoDBId);
      return res.send(userJobsList);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get all posted jobs', details: e });
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

  app.get(ROUTES.API.JOB.GET.jobById, requireLogin, async (req, res, done) => {
    try {
      const requestedJobId = req.params.jobId;
      if (!requestedJobId) {
        return res.send({ errorMsg: 'JobId Was Not Specified' });
      }

      let existingJob = null;

      existingJob = await jobDataAccess.findOneByJobId(requestedJobId);
      if (existingJob) {
        return res.send(existingJob);
      } else {
        return res.send({ errorMsg: 'JobId Was Not Specified' });
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To get job by id', details: e });
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
          _ownerRef: userMongoDBId,
        },
        userId
      );

      return res.send(newJob);
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To create new job', details: e });
    }
  });

  app.put(ROUTES.API.JOB.PUT.awardBidder, requireLogin, async (req, res) => {
    try {

      // create new job for this user
      const data = req.body.data;
      const userId = req.user.userId;
      const userMongoDBId = req.user._id;

      let existingJob = null;

      existingJob = await jobDataAccess.awardedBidder(data.jobId, data.bidId);
      if (existingJob) {
        return res.send(existingJob);
      }
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To award bidder', details: e });
    }
  });

  // app.put(ROUTES.API.JOB.PUT.jobImage, requireLogin, async (req, res) => {
  //   try {
  //     const filesList = req.files;
  //     // create new job for this user
  //     const data = req.body.data;
  //     const userId = req.user.userId;
  //     const userMongoDBId = req.user._id;

  //     const callbackFunc = (error, result) => {
  //       return res.send({
  //         errorMsg: error,
  //         result: result ? result.secure_url : {}
  //       });
  //     };

  //     await utils.uploadFileToCloudinary(filesList[0].path, callbackFunc);
  //   } catch (e) {
  //     return res
  //     .status(500)
  //     .send({ errorMsg: 'Failed To upload job image', details: e });
  //   }
  // });
};
