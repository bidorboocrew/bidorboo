const { requestDataAccess } = require('../data-access/requestDataAccess');
const { updateUserLastSearchDetails } = require('../data-access/userDataAccess');
const { uploadFileToCloudinary } = require('../utils/utilities');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requireRequestOwnerOrAwardedTasker = require('../middleware/requireRequestOwnerOrAwardedTasker');

const requireUserCanPost = require('../middleware/requireUserCanPost');
const requireRequestOwner = require('../middleware/requireRequestOwner');
const requireCurrentUserIsTheAwardedTasker = require('../middleware/requireCurrentUserIsTheAwardedTasker');
// const stripeServiceUtil = require('../services/stripeService').util;
module.exports = (app) => {
  app.get(ROUTES.API.REQUEST.GET.requestToBidOnDetailsForTasker, async (req, res) => {
    try {
      if (req.query && req.query.requestId) {
        const { requestId } = req.query;
        const requestDetails = await requestDataAccess.requestToBidOnDetailsForTasker(requestId);
        return res.send(requestDetails);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request for get request by id, requestId param was Not Specified',
        });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get request by id', details: `${e}` });
    }
  });

  app.get(ROUTES.API.REQUEST.GET.allrequestsToBidOn, requireBidorBooHost, async (req, res) => {
    try {
      const currentUserId = req.user ? req.user._id : '';

      let openRequestsForBidding = [];
      if (!currentUserId) {
        openRequestsForBidding = await requestDataAccess.getAllRequestsToBidOnForLoggedOut(currentUserId);
      } else {
        openRequestsForBidding = await requestDataAccess.getAllRequestsToBidOn(currentUserId);
      }

      return res.send(openRequestsForBidding);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get all posted requests', details: `${e}` });
    }
  });

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  app.delete(
    ROUTES.API.REQUEST.DELETE.postedRequestAndBidsForRequester,
    requireLogin,
    async (req, res, next) => {
      try {
        const mongoUser_id = req.user._id;
        const requestId = req.body.requestId;

        if (requestId) {
          const userRequestsList = await requestDataAccess.cancelRequest(requestId, mongoUser_id);
          return res.send(requestId);
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request RequestId param was Not Specified',
          });
        }
      } catch (e) {
        next(e);
        // return res.status(400).send({ errorMsg: 'Failed To delete request', details: `${e}` });
      }
    }
  );

  app.get(ROUTES.API.REQUEST.GET.awardedRequestFullDetailsForRequester, requireLogin, async (req, res) => {
    try {
      if (req.query && req.query.requestId) {
        const { requestId } = req.query;
        const requestFullDetails = await requestDataAccess.getAwardedRequestFullDetailsForRequester(requestId);
        return res.send(requestFullDetails);
      } else {
        return res.status(400).send({
          errorMsg: 'Bad Request for awarded request details, requestId param was Not Specified',
        });
      }
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To get requestFullDetailsById', details: `${e}` });
    }
  });

  app.get(
    ROUTES.API.REQUEST.GET.achivedTaskDetailsForRequester,
    requireLogin,
    requireRequestOwner,
    async (req, res) => {
      try {
        if (req.query && req.query.requestId) {
          const mongoUser_id = req.user._id;

          const { requestId } = req.query;
          const archivedRequestDetails = await requestDataAccess.getArchivedTaskDetailsForRequester({
            requestId,
            mongoUser_id,
          });
          return res.send(archivedRequestDetails);
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request cannot get past request details',
          });
        }
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To get request details', details: `${e}` });
      }
    }
  );

  app.get(ROUTES.API.REQUEST.GET.myAwardedRequests, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      const userRequestsList = await requestDataAccess.getUserAwardedRequests(req.user.userId);
      return res.send(userRequestsList);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To get my awarded requests', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.REQUEST.PUT.updateRequestState,
    requireLogin,
    requireRequestOwnerOrAwardedTasker,
    async (req, res, done) => {
      try {
        // create new request for this user
        const data = req.body.data;
        const { requestId, newState } = data;

        if (requestId && newState) {
          await requestDataAccess.updateState(requestId, newState);
          return res.send({ requestId, success: true });
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request param requestId was Not Specified',
          });
        }
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To update request state', details: `${e}` });
      }
    }
  );
  app.post(ROUTES.API.REQUEST.POST.searchRequests, requireBidorBooHost, async (req, res, done) => {
    try {
      const { searchParams } = req.body.data;
      if (!searchParams) {
        return res.status(400).send({
          errorMsg: 'Bad Request RequestId searchQuery params was Not Specified',
        });
      }

      let searchQuery = {
        searchLocation: searchParams.searchLocation,
        searchRaduisInMeters: searchParams.searchRaduis,
        requestTypeFilter: searchParams.requestTypeFilter,
      };

      existingRequest = await requestDataAccess.getRequestsNear(searchQuery, req.user ? req.user._id : '');
      if (existingRequest) {
        return res.send(existingRequest);
      } else {
        return res.send({ errorMsg: 'RequestId Was Not Specified' });
      }
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To perform the search', details: `${e}` });
    }
  });

  app.post(ROUTES.API.REQUEST.POST.newRequest, requireLogin, requireUserCanPost, async (req, res) => {
    try {
      const { requestDetails } = req.body.data;
      const mongoUser_id = req.user._id;
      const newRequest = await requestDataAccess.addARequest(requestDetails, mongoUser_id);

      // notify users that are interested xxxx FIX TO READ USER PREFERENCE on search RADUIS
      requestDataAccess.getUsersNearRequestAndNotifyThem(newRequest, req.user.userId);

      return res.send(newRequest);
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To create new request', details: `${e}` });
    }
  });
  app.post(ROUTES.API.REQUEST.POST.requestImage, requireLogin, async (req, res) => {
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
      return res.status(400).send({ errorMsg: 'Failed To upload request image', details: `${e}` });
    }
  });

  app.put(ROUTES.API.REQUEST.PUT.updateViewedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { requestId } = data;
      if (!requestId) {
        return res.status(400).send({
          errorMsg: 'Bad Request for updateViewedBy, requestId param was Not Specified',
        });
      }
      const mongoUser_id = req.user._id;

      await requestDataAccess.updateViewedBy(requestId, mongoUser_id);
      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To updateViewedBy', details: `${e}` });
    }
  });

  app.put(ROUTES.API.REQUEST.PUT.updateBooedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { requestId } = data;
      if (!requestId) {
        return res.status(400).send({
          errorMsg: 'Bad Request for updateBooedBy, requestId param was Not Specified',
        });
      }
      const mongoUser_id = req.user._id;

      await requestDataAccess.updateBooedBy(requestId, mongoUser_id);
      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To updateBooedBy', details: `${e}` });
    }
  });

  app.put(ROUTES.API.REQUEST.PUT.updateBooedBy, requireLogin, async (req, res) => {
    try {
      const data = req.body.data;
      const { requestId } = data;
      if (!requestId) {
        return res.status(400).send({
          errorMsg: 'Bad Request for updateBooedBy, requestId param was Not Specified',
        });
      }
      const mongoUser_id = req.user._id;

      await requestDataAccess.updateBooedBy(requestId, mongoUser_id);
      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To updateBooedBy', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.REQUEST.PUT.requesterConfirmsRequestCompleted,
    requireLogin,
    requireRequestOwner,
    async (req, res) => {
      /**
       * What we need to do here
       *  - update request sate to Done
       *  - update awarded bid state to Done
       *  - without waiting on the async -> delete all other bids associated with this request
       *  - notify both both and congrat for fulfilling this request and prompt to do another one
       */
      try {
        const data = req.body.data;
        const { requestId, completionDate } = data;
        if (!requestId) {
          return res.status(400).send({
            errorMsg: 'Bad Request for requesterConfirmsRequestCompletion param was Not Specified',
          });
        }

        await requestDataAccess.requesterConfirmsRequestCompletion(requestId, completionDate);

        return res.send({ success: true });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To requesterConfirmsRequestCompletion', details: `${e}` });
      }
    }
  );

  app.post(ROUTES.API.REQUEST.POST.updateSearchThenSearchRequests, async (req, res, next) => {
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
        await updateUserLastSearchDetails(userId, {
          searchRadius,
          location,
          addressText,
          tasksTypeFilter,
        });
      }

      let requestsAroundMe = await requestDataAccess.getRequestsNear(
        {
          searchRadius,
          location,
          tasksTypeFilter,
        },
        req.user ? req.user._id : ''
      );

      return res.send(requestsAroundMe);
    } catch (e) {
      return res
        .status(400)
        .send({ errorMsg: 'Failed To search for requests Settings', details: `${e}` });
    }
  });

  app.put(
    ROUTES.API.REQUEST.PUT.taskerConfirmsRequestCompleted,
    requireLogin,
    requireCurrentUserIsTheAwardedTasker,
    async (req, res) => {
      /**
       * What we need to do :
       *  - Update request completion.taskerConfirmed : true
       *  - Notify push and email Requester to confirm completion
       *  - start review process for Tasker
       */
      try {
        const data = req.body.data;
        const { requestId } = data;
        if (!requestId) {
          return res.status(400).send({
            errorMsg: 'Bad Request for taskerConfirmsRequestCompleted, requestId param was Not Specified',
          });
        }

        await requestDataAccess.taskerConfirmsRequestCompletion(requestId);
        return res.send({ success: true });
      } catch (e) {
        return res
          .status(400)
          .send({ errorMsg: 'Failed To taskerConfirmsRequestCompleted', details: `${e}` });
      }
    }
  );

  app.put(
    ROUTES.API.REQUEST.PUT.requesterDisputeRequest,
    requireLogin,
    requireRequestOwner,
    async (req, res) => {
      try {
        const data = req.body.data;
        const { requestId, requesterDispute } = data;
        if (!requestId || !requesterDispute) {
          return res.status(400).send({
            errorMsg: 'Bad Request for requesterDisputeRequest param was Not Specified',
          });
        }
        const { reason, details } = requesterDispute;
        if (!reason || !details) {
          return res.status(400).send({
            errorMsg: 'Bad Request for requesterDisputeRequest, missing params 2',
          });
        }

        await requestDataAccess.requesterDisputesRequest({ requestId, reason, details });

        return res.send({ success: true });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To requesterDisputeRequest', details: `${e}` });
      }
    }
  );
  app.put(
    ROUTES.API.REQUEST.PUT.taskerDisputeRequest,
    requireLogin,
    requireCurrentUserIsTheAwardedTasker,
    async (req, res) => {
      try {
        const data = req.body.data;
        const { requestId, taskerDispute } = data;

        if (!requestId || !taskerDispute) {
          return res.status(400).send({
            errorMsg: 'Bad Request for taskerDisputeRequest, missing params',
          });
        }
        const { reason, details } = taskerDispute;
        if (!reason || !details) {
          return res.status(400).send({
            errorMsg: 'Bad Request for taskerDisputeRequest, missing params 2',
          });
        }

        await requestDataAccess.taskerDisputesRequest({ requestId, reason, details });
        return res.send({ success: true });
      } catch (e) {
        return res.status(400).send({ errorMsg: 'Failed To taskerDisputeRequest', details: `${e}` });
      }
    }
  );

  // everything below this is reviewed and optimal
  app.get(
    ROUTES.API.REQUEST.GET.myRequestsSummary,
    requireBidorBooHost,
    requireLogin,
    async (req, res) => {
      try {
        const userRequestsList = await requestDataAccess.getMyRequestsSummary(req.user._id);

        return res.send({ myRequestsSummary: userRequestsList || [] });
      } catch (e) {
        console.log('BIDORBOO_ERROR: ROUTES.API.REQUEST.GET.getMyRequestsSummary ' + e);

        return res.status(400).send({ errorMsg: 'Failed To get requests summary' });
      }
    }
  );
  app.get(ROUTES.API.REQUEST.GET.postedRequestAndBidsForRequester, requireLogin, async (req, res) => {
    try {
      if (req.query && req.query.requestId) {
        const { requestId } = req.query;
        const mongoUser_id = req.user._id;

        const requestDetails = await requestDataAccess.postedRequestAndBidsForRequester(mongoUser_id, requestId);
        return res.send(requestDetails);
      } else {
        return res.status(400).send({
          errorMsg: "Bad Request, couldn't get request by id",
        });
      }
    } catch (e) {
      console.log('BIDORBOO_ERROR: ROUTES.API.REQUEST.GET.myRequestById ' + e);

      return res.status(400).send({ errorMsg: 'Failed To get request by id', details: `${e}` });
    }
  });
};
