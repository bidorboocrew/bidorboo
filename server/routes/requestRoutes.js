const { celebrate } = require('celebrate');
const { bugsnagClient } = require('../utils/utilities');;
const {
  requiresRequestId,
  deletePostedRequestAndBidsForRequester,
  updateRequestState,
  updateViewedBy,
  updateBooedBy,
  requesterConfirmsRequestCompleted,
  updateSearchThenSearchRequests,
  taskerConfirmsRequestCompleted,
  requesterDisputeRequest,
  taskerDisputeRequest,
} = require('../routeSchemas/rquestRoutesSchema');

const { requestDataAccess } = require('../data-access/requestDataAccess');
const { updateUserLastSearchDetails } = require('../data-access/userDataAccess');
const { uploadFileToCloudinary } = require('../utils/utilities');

const ROUTES = require('../backend-route-constants');

const requireLogin = require('../middleware/requireLogin');
const requireRequestOwnerOrAwardedTasker = require('../middleware/requireRequestOwnerOrAwardedTasker');

const requireUserCanPost = require('../middleware/requireUserCanPost');
const requireRequestOwner = require('../middleware/requireRequestOwner');
const requireCurrentUserIsTheAwardedTasker = require('../middleware/requireCurrentUserIsTheAwardedTasker');
module.exports = (app) => {
  app.get(
    ROUTES.API.REQUEST.GET.requestToBidOnDetailsForTasker,
    celebrate(requiresRequestId),
    async (req, res, next) => {
      try {
        const { requestId } = req.query;
        const requestDetails = await requestDataAccess.requestToBidOnDetailsForTasker(requestId);
        return res.send(requestDetails);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To get request by id';
        return next(e);
      }
    }
  );

  app.delete(
    ROUTES.API.REQUEST.DELETE.postedRequestAndBidsForRequester,
    celebrate(deletePostedRequestAndBidsForRequester),
    requireLogin,
    async (req, res, next) => {
      try {
        const mongoUser_id = req.user._id;
        const { requestId } = req.body;

        await requestDataAccess.cancelRequest(requestId, mongoUser_id);
        return res.send(requestId);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To delete request';
        return next(e);
      }
    }
  );

  app.get(
    ROUTES.API.REQUEST.GET.awardedRequestFullDetailsForRequester,
    celebrate(requiresRequestId),
    requireLogin,
    requireRequestOwner,
    async (req, res, next) => {
      try {
        const { requestId } = req.query;
        const requestFullDetails = await requestDataAccess.getAwardedRequestFullDetailsForRequester(
          requestId
        );
        return res.send(requestFullDetails);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To get request details';
        return next(e);
      }
    }
  );

  app.get(
    ROUTES.API.REQUEST.GET.achivedTaskDetailsForRequester,
    celebrate(requiresRequestId),
    requireLogin,
    requireRequestOwner,
    async (req, res, next) => {
      try {
        const mongoUser_id = req.user._id;

        const { requestId } = req.query;
        const archivedRequestDetails = await requestDataAccess.getArchivedTaskDetailsForRequester({
          requestId,
          mongoUser_id,
        });
        return res.send(archivedRequestDetails);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To get request details';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.REQUEST.PUT.updateRequestState,
    celebrate(updateRequestState),
    requireLogin,
    requireRequestOwnerOrAwardedTasker,
    async (req, res, done) => {
      try {
        // create new request for this user
        const data = req.body.data;
        const { requestId, newState } = data;
        await requestDataAccess.updateState(requestId, newState);
        return res.send({ requestId, success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To update request state';
        return next(e);
      }
    }
  );
  //XXXXX for each job type specify what is acceptable here
  app.post(
    ROUTES.API.REQUEST.POST.createNewRequest,
    requireLogin,
    requireUserCanPost,
    async (req, res, next) => {
      try {
        const { requestDetails } = req.body.data;
        const mongoUser_id = req.user._id;
        const newRequest = await requestDataAccess.addARequest(requestDetails, mongoUser_id);

        // notify users that are interested xxxx FIX TO READ USER PREFERENCE on search RADUIS
        requestDataAccess.getUsersNearRequestAndNotifyThem(newRequest, req.user.userId);

        return res.send(newRequest);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To create new request';
        return next(e);
      }
    }
  );
  app.post(ROUTES.API.REQUEST.POST.requestImage, requireLogin, async (req, res, next) => {
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

        await Promise.all(cloudinaryUploadReqs);

        res.send({
          taskImages: cloudinaryHostedImageObj,
        });
      }
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To upload request image';
      return next(e);
    }
  });

  app.put(
    ROUTES.API.REQUEST.PUT.updateViewedBy,
    celebrate(updateViewedBy),
    requireLogin,
    async (req, res, next) => {
      try {
        const { requestId } = req.body.data;
        const mongoUser_id = req.user._id;
        await requestDataAccess.updateViewedBy(requestId, mongoUser_id);
        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To update viewed by';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.REQUEST.PUT.updateBooedBy,
    celebrate(updateBooedBy),
    requireLogin,
    async (req, res, next) => {
      try {
        const { requestId } = req.body.data;

        const mongoUser_id = req.user._id;

        await requestDataAccess.updateBooedBy(requestId, mongoUser_id);
        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To update booed by';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.REQUEST.PUT.requesterConfirmsRequestCompleted,
    celebrate(requesterConfirmsRequestCompleted),
    requireLogin,
    requireRequestOwner,
    async (req, res, next) => {
      try {
        const { requestId } = req.body.data;

        await requestDataAccess.requesterConfirmsRequestCompletion(requestId);

        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To confirms request completion';
        return next(e);
      }
    }
  );

  app.post(
    ROUTES.API.REQUEST.POST.updateSearchThenSearchRequests,
    celebrate(updateSearchThenSearchRequests),
    async (req, res, next) => {
      try {
        const { searchRadius, location, addressText, tasksTypeFilter } = req.body.data;

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

        let requestsAroundMe = await requestDataAccess.searchRequestsByLocationForLoggedInTasker(
          {
            searchRadius,
            location,
            tasksTypeFilter,
          },
          req.user ? req.user._id : ''
        );

        return res.send(requestsAroundMe);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To search for requests';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.REQUEST.PUT.taskerConfirmsRequestCompleted,
    celebrate(taskerConfirmsRequestCompleted),
    requireLogin,
    requireCurrentUserIsTheAwardedTasker,
    async (req, res, next) => {
      try {
        const { requestId } = req.body.data;

        await requestDataAccess.taskerConfirmsRequestCompletion(requestId);
        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To confirm completion';
        return next(e);
      }
    }
  );

  app.put(
    ROUTES.API.REQUEST.PUT.requesterDisputeRequest,
    celebrate(requesterDisputeRequest),
    requireLogin,
    requireRequestOwner,
    async (req, res, next) => {
      try {
        const { requestId, reason, details } = req.body.data;

        await requestDataAccess.requesterDisputesRequest({ requestId, reason, details });

        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To file dispute request';
        return next(e);
      }
    }
  );
  app.put(
    ROUTES.API.REQUEST.PUT.taskerDisputeRequest,
    celebrate(taskerDisputeRequest),
    requireLogin,
    requireCurrentUserIsTheAwardedTasker,
    async (req, res, next) => {
      try {
        const { requestId, reason, details } = req.body.data;

        await requestDataAccess.taskerDisputesRequest({ requestId, reason, details });
        return res.send({ success: true });
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To file dispute request';
        return next(e);
      }
    }
  );

  // everything below this is reviewed and optimal
  app.get(ROUTES.API.REQUEST.GET.myRequestsSummary, requireLogin, async (req, res, next) => {
    try {
      const userRequestsList = await requestDataAccess.getMyRequestsSummary(req.user._id);

      return res.send({ myRequestsSummary: userRequestsList || [] });
    } catch (e) {
      bugsnagClient.notify(e);

      e.safeMsg = 'Failed To get requests summary';
      return next(e);
    }
  });
  app.get(
    ROUTES.API.REQUEST.GET.postedRequestAndBidsForRequester,
    celebrate(requiresRequestId),
    requireLogin,
    async (req, res, next) => {
      try {
        const { requestId } = req.query;
        const mongoUser_id = req.user._id;

        const requestDetails = await requestDataAccess.postedRequestAndBidsForRequester(
          mongoUser_id,
          requestId
        );
        return res.send(requestDetails);
      } catch (e) {
        bugsnagClient.notify(e);

        e.safeMsg = 'Failed To get requests by id';
        return next(e);
      }
    }
  );
};
