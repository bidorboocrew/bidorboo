import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';
import moment from 'moment';
import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';

export const updateRequestState = (requestId, newState) => (dispatch) => {
  return dispatch({
    type: A.REQUEST_ACTIONS.UPDATE_STATE,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.updateRequestState, {
        data: {
          requestId,
          newState,
        },
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
export const updateBooedBy = (requestDetails) => (dispatch) =>
  dispatch({
    type: A.REQUEST_ACTIONS.UPDATE_REQUEST_BOOED_BY,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.updateBooedBy, {
        data: {
          requestId: requestDetails._id,
        },
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const updateViewedBy = (requestDetails) => (dispatch) =>
  dispatch({
    type: A.REQUEST_ACTIONS.UPDATE_REQUEST_VIEWED_BY,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.updateViewedBy, {
        data: {
          requestId: requestDetails._id,
        },
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const cancelRequestById = (requestId) => (dispatch) => {
  const req = dispatch({
    type: A.REQUEST_ACTIONS.DELETE_REQUEST_BY_ID,
    payload: axios.delete(ROUTES.API.REQUEST.DELETE.postedRequestAndBidsForRequester, {
      data: { requestId: requestId },
    }),
  });

  req.then((resp) => {
    if (resp && resp.value && resp.value.data) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'success',
            msg: 'Service Request was sucessfully deleted.',
          },
        },
      });

      switchRoute(`${ROUTES.CLIENT.REQUESTER.myRequestsPage}`);
    }
  });
};

export const searchRequestsToBidOn = (values) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: values,
  });

  dispatch({
    type: A.REQUEST_ACTIONS.GET_ALL_POSTED_REQUESTS_VIA_SEARCH,
    payload: axios
      .post(ROUTES.API.REQUEST.POST.updateSearchThenSearchRequests, postData, config)
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getAwardedRequestFullDetailsforRequester = (requestId) => (dispatch) => {
  dispatch({
    type: A.REQUEST_ACTIONS.GET_AWARDED_REQUEST_FULL_DETAILS_FOR_REQUESTER,
    payload: axios
      .get(ROUTES.API.REQUEST.GET.awardedRequestFullDetailsForRequester, { params: { requestId } })
      .then((resp) => {
        if (resp && resp.data) {
          dispatch({
            type: A.REQUEST_ACTIONS.SELECT_AWARDED_REQUEST,
            payload: { data: resp.data },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const requesterConfirmsRequestCompletion = (requestId) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      requestId,
      completionDate: moment.utc(new Date()).toISOString(),
    },
  });

  dispatch({
    type: A.REQUEST_ACTIONS.REQUESTER_CONFIRMS_REQUEST_COMPLETION,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.requesterConfirmsRequestCompleted, postData, config)
      .then((resp) => {
        if (resp && resp.data) {
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const requesterDisputesRequest = ({ requesterDispute }) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      requestId: requesterDispute.requestId,
      requesterDispute,
    },
  });

  dispatch({
    type: A.REQUEST_ACTIONS.REQUESTER_DISPUTES_REQUEST,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.requesterDisputeRequest, postData, config)
      .then((resp) => {
        if (resp && resp.data) {
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const taskerDisputesRequest = ({ taskerDispute }) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      requestId: taskerDispute.requestId,
      taskerDispute,
    },
  });

  dispatch({
    type: A.REQUEST_ACTIONS.TASKER_DISPUTES_REQUEST,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.taskerDisputeRequest, postData, config)
      .then((resp) => {
        if (resp && resp.data) {
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const taskerConfirmsRequestCompletion = (requestId) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      requestId,
    },
  });

  dispatch({
    type: A.REQUEST_ACTIONS.TASKER_CONFIRMS_REQUEST_COMPLETION,
    payload: axios
      .put(ROUTES.API.REQUEST.PUT.taskerConfirmsRequestCompleted, postData, config)
      .then((resp) => {
        if (resp && resp.data && resp.data.success) {
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const markBidAsSeen = (requestId, bidId) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = {
    data: {
      requestId,
      bidId,
    },
  };

  const response = dispatch({
    type: A.REQUEST_ACTIONS.REQUEST_MARK_BID_AS_SEEN,
    payload: axios.put(ROUTES.API.BID.PUT.markBidAsSeen, postData, config),
  });
  response.then(({ value }) => {
    if (value) {
      dispatch({
        type: A.REQUEST_ACTIONS.MARK_BID_AS_SEEN,
        payload: { requestId, bidId },
      });
    }
  });
};

export const postNewRequest = ({ requestDetails, recaptchaField }) => (dispatch) => {
  return dispatch({
    type: A.REQUEST_ACTIONS.ADD_NEW_REQUEST,
    payload: axios
      .post(ROUTES.API.REQUEST.POST.createNewRequest, {
        recaptchaField,
        data: {
          requestDetails,
        },
      })
      .then((resp) => {
        if (resp.data && resp.data._id) {
          const { templateId } = resp.data;

          switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);

          const taskDefinition = TASKS_DEFINITIONS[templateId];

          dispatch({
            type: A.UI_ACTIONS.SHOW_SPECIAL_MOMENT,
            payload: {
              specialMomentContent: taskDefinition.renderThankYouForPostingMoment,
            },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const uploadTaskImages = (taskImages) => (dispatch) => {
  let data = new FormData();

  taskImages &&
    taskImages.length > 0 &&
    taskImages.forEach((file, index) => {
      data.append('filesToUpload', file, `requestImages+${index}`);
    });
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  if (taskImages && taskImages.length) {
    return dispatch({
      type: A.REQUEST_ACTIONS.ADD_NEW_REQUEST,
      payload: axios.put(ROUTES.API.REQUEST.PUT.requestImage, data, config).then((resp2) => {
        if (resp2 && resp2.data.success && resp2.data.requestId) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'Images Were Uploaded.',
              },
            },
          });
        }
      }),
    });
  } else {
    dispatch({
      type: A.UI_ACTIONS.SHOW_TOAST_MSG,
      payload: {
        toastDetails: {
          type: 'success',
          msg: 'Failed to upload images.',
        },
      },
    });
  }
};

export const getMyRequestsSummary = () => (dispatch) =>
  dispatch({
    type: A.REQUEST_ACTIONS.GET_MY_REQUESTS_SUMMARY,
    payload: axios.get(ROUTES.API.REQUEST.GET.myRequestsSummary),
  });

export const getPostedRequestAndBidsForRequester = (requestId) => (dispatch) => {
  if (!requestId) {
    return;
  }

  return dispatch({
    type: A.REQUEST_ACTIONS.GET_POSTED_REQUEST_AND_BIDS_FOR_REQUESTER,
    payload: axios
      .get(ROUTES.API.REQUEST.GET.postedRequestAndBidsForRequester, { params: { requestId } })
      .then((resp) => {
        if (resp && resp.data) {
          dispatch({
            type: A.REQUEST_ACTIONS.SELECT_ACTIVE_POSTED_REQUEST,
            payload: { data: resp.data },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getArchivedTaskDetailsForRequester = (requestId) => (dispatch) => {
  if (!requestId) {
    return;
  }
  dispatch({
    type: A.REQUEST_ACTIONS.SELECT_ARCHIVE_REQUEST,
    payload: { data: {} },
  });

  return dispatch({
    type: A.REQUEST_ACTIONS.GET_ARCHIVED_REQUEST_DETAILS_FOR_REQUESTER,
    payload: axios
      .get(ROUTES.API.REQUEST.GET.achivedTaskDetailsForRequester, { params: { requestId } })
      .then((resp) => {
        if (resp && resp.data) {
          dispatch({
            type: A.REQUEST_ACTIONS.SELECT_ARCHIVE_REQUEST,
            payload: { data: resp.data },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
