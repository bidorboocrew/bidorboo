const { jobDataAccess } = require('../data-access/jobDataAccess');
const { updateUserLastSearchDetails } = require('../data-access/userDataAccess');

const requirePassesRecaptcha = require('../middleware/requirePassesRecaptcha');
const ROUTES = require('../backend-route-constants');
const utils = require('../utils/utilities');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requireUserCanPost = require('../middleware/requireUserCanPost');
const requireJobOwner = require('../middleware/requireJobOwner');
const requireCurrentUserIsTheAwardedBidder = require('../middleware/requireCurrentUserIsTheAwardedBidder');
// const stripeServiceUtil = require('../services/stripeService').util;
module.exports = (app) => {
  app.get(ROUTES.API.JOB.GET.myOpenJobs, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      userJobsList = await jobDataAccess.getUserJobsByState(req.user.userId, 'OPEN');
      return res.send(userJobsList);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get my open jobs', details: `${e}` });
    }
  });

  app.get(ROUTES.API.JOB.GET.myJobById, requireLogin, async (req, res) => {
    try {
      if (req.query && req.query.jobId) {
        const { jobId } = req.query;
        const mongoUser_id = req.user._id;

        const jobDetails = await jobDataAccess.getJobWithBidDetails(mongoUser_id, jobId);
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

  app.get(ROUTES.API.JOB.GET.jobToBidDetailsById, requireLogin, async (req, res) => {
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
    ROUTES.API.JOB.DELETE.myJobById,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
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
        return res.status(400).send({ errorMsg: 'Failed To delete job', details: `${e}` });
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
        const userJobsList = await jobDataAccess.getAllRequestsByUserId(req.user.userId);
        if (userJobsList && userJobsList._postedJobsRef) {
          return res.send({ allRequests: userJobsList._postedJobsRef });
        }
        return res.send({ allRequests: [] });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To get getAllMyRequests', details: `${e}` });
      }
    }
  );

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

      existingJob = await jobDataAccess.getJobsNear(searchQuery);
      if (existingJob) {
        return res.send(existingJob);
      } else {
        return res.send({ errorMsg: 'JobId Was Not Specified' });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To perform the search', details: `${e}` });
    }
  });

  app.post(
    ROUTES.API.JOB.POST.newJob,
    requireLogin,
    requireUserCanPost,
    requirePassesRecaptcha,
    async (req, res) => {
      try {
        const { jobDetails } = req.body.data;
        const mongoUser_id = req.user._id;
        const newJob = await jobDataAccess.addAJob(jobDetails, mongoUser_id);

        return res.send(newJob);
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To create new job', details: `${e}` });
      }
    }
  );
  // app.put(ROUTES.API.JOB.PUT.jobImage, requireLogin, async (req, res) => {
  //   try {
  //     const filesList = req.files;
  //     // create new job for this user
  //     const jobId = req.body.jobId;
  //     const mongoUser_id = req.user._id;
  //     let cloudinaryHostedImageObj = [];
  //     const callbackFunc = (error, result) => {
  //       // update the user data model
  //       if (result) {
  //         const { secure_url, public_id } = result;
  //         cloudinaryHostedImageObj.push({ secure_url, public_id });
  //       }
  //     };

  //     if (filesList && filesList.length > 0) {
  //       const cloudinaryUploadReqs = [];
  //       filesList.forEach((file) => {
  //         cloudinaryUploadReqs.push(
  //           utils.uploadFileToCloudinary(
  //             file.path,
  //             {
  //               folder: `${mongoUser_id}/${jobId}`,
  //             },
  //             callbackFunc
  //           )
  //         );
  //       });
  //       const uploadImages = await Promise.all(cloudinaryUploadReqs);

  //       if (jobId && cloudinaryHostedImageObj.length > 0) {
  //         jobDataAccess.addJobImages(jobId, cloudinaryHostedImageObj);
  //       }
  //       res.send({
  //         success: true,
  //         jobId: jobId,
  //       });
  //     }
  //   } catch (e) {
  //     return res.status(400).send({ errorMsg: 'Failed To upload job image', details: `${e}` });
  //   }
  // });

  app.put(ROUTES.API.JOB.PUT.awardBidder, requireLogin, requireJobOwner, async (req, res) => {
    try {
      // create new job for this user
      const data = req.body.data;
      // const userId = req.user.userId;
      // const mongoUser_id = req.user._id;

      const { jobId, bidId } = data;
      let existingJob = null;

      existingJob = await jobDataAccess.awardBidder(jobId, bidId);
      if (existingJob) {
        return res.send(existingJob);
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To award bidder', details: `${e}` });
    }
  });

  app.put(ROUTES.API.JOB.PUT.updateViewedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { jobId } = data;
      if (!jobId) {
        return res.status(400).send({
          errorMsg: 'Bad Request forupdateViewedBy, jobId param was Not Specified',
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

  app.post(ROUTES.API.JOB.POST.updateUserLastSearchDetails, async (req, res) => {
    try {
      const searchDetails = req.body.data;
      if (!searchDetails) {
        return res.status(403).send({
          errorMsg: 'searchDetails failed due to missing params',
        });
      }
      const { searchRadius, location, addressText, selectedTemplateIds } = searchDetails;
      if (!searchRadius || !location || !addressText || !selectedTemplateIds) {
        return res.status(403).send({
          errorMsg: 'searchDetails failed due to missing details',
        });
      }

      const userId = req.user && req.user.userId;
      // update if user is logged in
      if (userId) {
        const updatedTheUser = await updateUserLastSearchDetails(userId, {
          searchRadius,
          location,
          addressText,
          selectedTemplateIds,
        });
      }

      existingJob = await jobDataAccess.getJobsNear({
        searchRadius,
        location,
        selectedTemplateIds,
      });

      if (existingJob) {
        return res.send(existingJob);
      } else {
        return res.send({ errorMsg: 'JobId Was Not Specified' });
      }

      return res.send({ success: true });
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To update user notification Settings', details: `${e}` });
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
};
