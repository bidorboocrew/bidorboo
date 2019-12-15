const { jobDataAccess } = require('../data-access/jobDataAccess');
const { updateUserLastSearchDetails } = require('../data-access/userDataAccess');
const { uploadFileToCloudinary } = require('../utils/utilities');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requireUserCanPost = require('../middleware/requireUserCanPost');
const requireJobOwner = require('../middleware/requireJobOwner');
const requireCurrentUserIsTheAwardedBidder = require('../middleware/requireCurrentUserIsTheAwardedBidder');
// const stripeServiceUtil = require('../services/stripeService').util;
module.exports = (app) => {
  app.get(ROUTES.API.JOB.GET.jobToBidDetailsById, async (req, res) => {
    try {
      if (req.query && req.query.jobId) {
        const { jobId } = req.query;
        const jobDetails = await jobDataAccess.getJobToBidOnDetails(jobId);
        return res.send(jobDetails);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request for get job by id, jobId param was Not Specified',
        });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get job by id', details: `${e}` });
    }
  });

  app.get(ROUTES.API.JOB.GET.alljobsToBidOn, requireBidorBooHost, async (req, res) => {
    try {
      const currentUserId = req.user ? req.user._id : '';

      let openRequestsForBidding = [];
      if (!currentUserId) {
        openRequestsForBidding = await jobDataAccess.getAllJobsToBidOnForLoggedOut(currentUserId);
      } else {
        openRequestsForBidding = await jobDataAccess.getAllJobsToBidOn(currentUserId);
      }

      return res.send(openRequestsForBidding);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get all posted jobs', details: `${e}` });
    }
  });

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  app.delete(
    ROUTES.API.JOB.DELETE.postedJobAndBidsForRequester,
    requireBidorBooHost,
    requireLogin,
    async (req, res, next) => {
      try {
        const mongoUser_id = req.user._id;
        const jobId = req.body.jobId;

        if (jobId) {
          userJobsList = await jobDataAccess.cancelJob(jobId, mongoUser_id);
          return res.send(jobId);
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request JobId param was Not Specified',
          });
        }
      } catch (e) {
        next(e);
        // return res.status(400).send({ errorMsg: 'Failed To delete job', details: `${e}` });
      }
    }
  );

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
        return res
          .status(400)
          .send({ errorMsg: 'Failed To get jobFullDetailsById', details: `${e}` });
      }
    }
  );

  app.get(ROUTES.API.JOB.GET.myAwardedJobs, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      userJobsList = await jobDataAccess.getUserAwardedJobs(req.user.userId);
      return res.send(userJobsList);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get my awarded jobs', details: `${e}` });
    }
  });

  app.get(
    ROUTES.API.JOB.GET.getAllMyRequests,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const userJobsList = await jobDataAccess.getAllRequestsByUserId(req.user._id);
        if (userJobsList && userJobsList) {
          return res.send({ allRequests: userJobsList });
        }
        return res.send({ allRequests: [] });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To get getAllMyRequests', details: `${e}` });
      }
    }
  );
  app.put(ROUTES.API.JOB.PUT.updateJobState, requireLogin, async (req, res, done) => {
    try {
      // create new job for this user
      const data = req.body.data;
      const { jobId, newState } = data;

      if (jobId && newState) {
        await jobDataAccess.updateState(jobId, newState);
        return res.send({ jobId, success: true });
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request param jobId was Not Specified',
        });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To update Job State', details: `${e}` });
    }
  });
  app.post(ROUTES.API.JOB.POST.searchJobs, requireBidorBooHost, async (req, res, done) => {
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

      existingJob = await jobDataAccess.getJobsNear(searchQuery, req.user ? req.user._id : '');
      if (existingJob) {
        return res.send(existingJob);
      } else {
        return res.send({ errorMsg: 'JobId Was Not Specified' });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To perform the search', details: `${e}` });
    }
  });

  app.post(ROUTES.API.JOB.POST.newJob, requireLogin, requireUserCanPost, async (req, res) => {
    try {
      const { jobDetails } = req.body.data;
      const mongoUser_id = req.user._id;
      const newJob = await jobDataAccess.addAJob(jobDetails, mongoUser_id);

      // notify users that are interested xxxx FIX TO READ USER PREFERENCE on search RADUIS
      jobDataAccess.getUsersNearJobAndNotifyThem(newJob, req.user.userId);

      return res.send(newJob);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To create new job', details: `${e}` });
    }
  });
  app.post(ROUTES.API.JOB.POST.jobImage, requireLogin, async (req, res) => {
    try {
      const filesList = req.files;

      const mongoUser_id = req.user._id;

      let cloudinaryHostedImageObj = [];
      const callbackFunc = (error, result) => {
        // update the user data model
        if (!error && result) {
          const { secure_url, public_id } = result;
          cloudinaryHostedImageObj.push({ public_id, url: secure_url });
        }
      };

      if (filesList && filesList.length > 0) {
        const cloudinaryUploadReqs = [];
        filesList.forEach((file) => {
          cloudinaryUploadReqs.push(
            uploadFileToCloudinary(
              file.path,
              {
                folder: `${mongoUser_id}/ReqestsImages`,
                transformation: [{ quality: 'auto' }],
              },
              callbackFunc
            )
          );
        });

        const imageUploadResults = await Promise.all(cloudinaryUploadReqs);

        res.send({
          taskImages: cloudinaryHostedImageObj,
        });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To upload job image', details: `${e}` });
    }
  });

  app.put(ROUTES.API.JOB.PUT.updateViewedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { jobId } = data;
      if (!jobId) {
        return res.status(400).send({
          errorMsg: 'Bad Request for updateViewedBy, jobId param was Not Specified',
        });
      }
      const mongoUser_id = req.user._id;

      await jobDataAccess.updateViewedBy(jobId, mongoUser_id);
      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To updateViewedBy', details: `${e}` });
    }
  });

  app.put(ROUTES.API.JOB.PUT.updateBooedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { jobId } = data;
      if (!jobId) {
        return res.status(400).send({
          errorMsg: 'Bad Request for updateBooedBy, jobId param was Not Specified',
        });
      }
      const mongoUser_id = req.user._id;

      await jobDataAccess.updateBooedBy(jobId, mongoUser_id);
      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To updateBooedBy', details: `${e}` });
    }
  });

  app.put(ROUTES.API.JOB.PUT.updateBooedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { jobId } = data;
      if (!jobId) {
        return res.status(400).send({
          errorMsg: 'Bad Request for updateBooedBy, jobId param was Not Specified',
        });
      }
      const mongoUser_id = req.user._id;

      await jobDataAccess.updateBooedBy(jobId, mongoUser_id);
      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To updateBooedBy', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.JOB.PUT.proposerConfirmsJobCompleted,
    requireLogin,
    requireJobOwner,
    async (req, res) => {
      /**
       * What we need to do here
       *  - update Job.jobCompletion.proposerCponfirmed -> true
       *  - update job sate to Done
       *  - update awarded bid state to Done
       *  - without waiting on the async -> delete all other bids associated with this job
       *  - notify both both and congrat for fulfilling this request and prompt to do another one
       */
      try {
        const data = req.body.data;
        const { jobId } = data;
        if (!jobId) {
          return res.status(400).send({
            errorMsg: 'Bad Request for requesterConfirmsJobCompletion param was Not Specified',
          });
        }

        await jobDataAccess.requesterConfirmsJobCompletion(jobId);

        return res.send({ success: true });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To requesterConfirmsJobCompletion', details: `${e}` });
      }
    }
  );

  app.post(ROUTES.API.JOB.POST.updateSearchThenSearchJobs, async (req, res, next) => {
    try {
      const searchDetails = req.body.data;
      if (!searchDetails) {
        return res.status(403).send({
          errorMsg: 'searchDetails failed due to missing params',
        });
      }
      const {
        searchRadius,
        location,
        addressText,
        tasksTypeFilter = [
          'bdbHouseCleaning',
          'bdbCarDetailing',
          'bdbPetSittingWalking',
          'bdbMoving',
        ],
      } = searchDetails;
      if (
        !searchRadius ||
        !addressText ||
        !location ||
        location.lat === '' ||
        location.lng === ''
      ) {
        return res.status(403).send({
          errorMsg: 'searchDetails failed due to invalid params ',
        });
      }

      const userId = req.user && req.user.userId;
      // update if user is logged in
      if (userId) {
        const updatedTheUser = await updateUserLastSearchDetails(userId, {
          searchRadius,
          location,
          addressText,
          tasksTypeFilter,
        });
      }

      let jobsAroundMe = await jobDataAccess.getJobsNear(
        {
          searchRadius,
          location,
          tasksTypeFilter,
        },
        req.user ? req.user._id : ''
      );

      return res.send(jobsAroundMe);
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To search for jobs Settings', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.JOB.PUT.bidderConfirmsJobCompleted,
    requireLogin,
    requireCurrentUserIsTheAwardedBidder,
    async (req, res) => {
      /**
       * What we need to do :
       *  - Update Job completion.bidderConfirmed : true
       *  - Notify push and email Requester to confirm completion
       *  - start review process for Tasker
       */
      try {
        const data = req.body.data;
        const { jobId } = data;
        if (!jobId) {
          return res.status(400).send({
            errorMsg: 'Bad Request for bidderConfirmsJobCompleted, jobId param was Not Specified',
          });
        }

        await jobDataAccess.bidderConfirmsJobCompletion(jobId);
        return res.send({ success: true });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To bidderConfirmsJobCompleted', details: `${e}` });
      }
    }
  );

  app.put(
    ROUTES.API.JOB.PUT.proposerDisputeJob,
    requireLogin,
    requireJobOwner,
    async (req, res) => {
      try {
        const data = req.body.data;
        const { jobId, proposerDispute } = data;
        if (!jobId || !proposerDispute) {
          return res.status(400).send({
            errorMsg: 'Bad Request for proposerDisputeJob param was Not Specified',
          });
        }
        const { reason, details } = proposerDispute;
        if (!reason || !details) {
          return res.status(400).send({
            errorMsg: 'Bad Request for proposerDisputeJob, missing params 2',
          });
        }

        await jobDataAccess.requesterDisputesJob({ jobId, reason, details });

        return res.send({ success: true });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To proposerDisputeJob', details: `${e}` });
      }
    }
  );
  app.put(
    ROUTES.API.JOB.PUT.bidderDisputeJob,
    requireLogin,
    requireCurrentUserIsTheAwardedBidder,
    async (req, res) => {
      try {
        const data = req.body.data;
        const { jobId, taskerDispute } = data;

        if (!jobId || !taskerDispute) {
          return res.status(400).send({
            errorMsg: 'Bad Request for bidderDisputeJob, missing params',
          });
        }
        const { reason, details } = taskerDispute;
        if (!reason || !details) {
          return res.status(400).send({
            errorMsg: 'Bad Request for bidderDisputeJob, missing params 2',
          });
        }

        await jobDataAccess.taskerDisputesJob({ jobId, reason, details });
        return res.send({ success: true });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To bidderDisputeJob', details: `${e}` });
      }
    }
  );

  // everything below this is reviewed and optimal
  app.get(
    ROUTES.API.JOB.GET.myRequestsSummary,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const userJobsList = await jobDataAccess.getMyRequestsSummary(req.user._id);
        if (userJobsList && userJobsList) {
          return res.send({ myRequestsSummary: userJobsList });
        }
        return res.send({ myRequestsSummary: [] });
      } catch (e) {
        console.log('BIDORBOO_ERROR: ROUTES.API.JOB.GET.getMyRequestsSummary ' + e);

        return res.status(400).send({ errorMsg: 'Failed To get requests summary' });
      }
    }
  );
  app.get(ROUTES.API.JOB.GET.postedJobAndBidsForRequester, requireLogin, async (req, res) => {
    try {
      if (req.query && req.query.jobId) {
        const { jobId } = req.query;
        const mongoUser_id = req.user._id;

        const jobDetails = await jobDataAccess.getJobWithBidDetails(mongoUser_id, jobId);
        return res.send(jobDetails);
      } else {
        return res.status(400).send({
          errorMsg: "Bad Request, couldn't get job by id",
        });
      }
    } catch (e) {
      console.log('BIDORBOO_ERROR: ROUTES.API.JOB.GET.myJobById ' + e);

      return res.status(400).send({ errorMsg: 'Failed To get job by id', details: `${e}` });
    }
  });
};
