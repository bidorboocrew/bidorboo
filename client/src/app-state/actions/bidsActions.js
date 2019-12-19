import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification, delayedReload } from '../../utils';
import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';

export const getRequestToBidOnDetails = (requestId, isLoggedIn = false) => (dispatch) =>
  dispatch({
    type: A.REQUEST_ACTIONS.GET_REQUEST_To_BID_ON_DETAILS_BY_ID,
    payload: axios
      .get(ROUTES.API.REQUEST.GET.requestToBidOnDetailsForTasker, { params: { requestId } })
      .then((resp) => {
        if (resp && resp.data) {
          if (isLoggedIn) {
            dispatch({
              type: A.REQUEST_ACTIONS.UPDATE_REQUEST_VIEWED_BY,
              payload: axios
                .put(ROUTES.API.REQUEST.PUT.updateViewedBy, {
                  data: {
                    requestId: resp.data._id,
                  },
                })
                .catch((error) => {
                  throwErrorNotification(dispatch, error);
                }),
            });
          }
          //update store with the request details
          dispatch({
            type: A.TASKER_ACTIONS.SELECT_REQUEST_TO_BID_ON,
            payload: {
              requestDetails: resp.data,
            },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const submitBid = ({ bidAmount, request, recaptchaField }) => (dispatch) => {
  //update store with the request details

  const { _id: requestId, templateId } = request;
  dispatch({
    type: A.TASKER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.BID.POST.createNewBid, {
        recaptchaField: recaptchaField,
        data: {
          requestId,
          bidAmount: bidAmount,
        },
      })
      .then((resp) => {
        // update recently added request
        if (resp.data && resp.data._id) {
          const taskDefinition = TASKS_DEFINITIONS[templateId];
          //rediret user to the current bid
          switchRoute(ROUTES.CLIENT.TASKER.mybids);
          dispatch({
            type: A.UI_ACTIONS.SHOW_SPECIAL_MOMENT,
            payload: {
              specialMomentContent: taskDefinition.renderThankYouForPostingBid,
            },
          });

          // dispatch({
          //   type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          //   payload: {
          //     toastDetails: {
          //       type: 'success',
          //       msg: 'You have made your bid. Good Luck!',
          //     },
          //   },
          // });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const deleteOpenBid = (bidId) => (dispatch) => {
  //update store with the request details
  dispatch({
    type: A.TASKER_ACTIONS.DELETE_AN_OPEN_BID,
    payload: axios
      .delete(ROUTES.API.BID.DELETE.deleteOpenBid, {
        data: { bidId },
      })
      .then((resp) => {
        // update recently added request
        if (resp.data && resp.data.success) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'You have deleted your bid!',
              },
            },
          });
          // xxxx update without reload
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const cancelAwardedBid = (bidId) => (dispatch) => {
  //update store with the request details
  dispatch({
    type: A.TASKER_ACTIONS.CANCEL_MY_AWARDED_BID,
    payload: axios
      .delete(ROUTES.API.BID.DELETE.cancelAwardedBid, {
        data: { bidId },
      })
      .then((resp) => {
        // update recently added request
        if (resp.data && resp.data.success) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'You have deleted your bid!',
              },
            },
          });
          // xxxx update without reload
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const updateBid = ({ bidId, bidAmount, request }) => (dispatch) => {
  //update store with the request details
  const { templateId } = request;

  dispatch({
    type: A.TASKER_ACTIONS.UPDATE_A_BID,
    payload: axios
      .post(ROUTES.API.BID.PUT.updateMyBid, {
        data: {
          bidId,
          bidAmount,
        },
      })
      .then((resp) => {
        // update recently added request
        if (resp.data && resp.data._id) {
          // xxxx update some store value instead of reloading the page
          const taskDefinition = TASKS_DEFINITIONS[templateId];

          dispatch({
            type: A.UI_ACTIONS.SHOW_SPECIAL_MOMENT,
            payload: {
              specialMomentContent: taskDefinition.renderThankYouForEditingBid,
            },
          });

          //rediret user to the current bid

          delayedReload(
            ROUTES.CLIENT.TASKER.dynamicReviewMyOpenBidAndTheRequestDetails(resp.data._id),
          );

          // dispatch({
          //   type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          //   payload: {
          //     toastDetails: {
          //       type: 'success',
          //       msg: 'You have udpated your bid. Good Luck!',
          //     },
          //   },
          // });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getMyPostedBidsSummary = () => (dispatch) => {
  //update store with the request details
  dispatch({
    type: A.TASKER_ACTIONS.GET_ALL_MY_OPEN_BIDS,
    payload: axios.get(ROUTES.API.BID.GET.myPostedBidsSummary).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};

export const getOpenBidDetails = (openBidId) => (dispatch) => {
  //update store with the request details
  dispatch({
    type: A.TASKER_ACTIONS.GET_OPEN_BID_DETAILS,
    payload: axios
      .get(ROUTES.API.BID.GET.openBidDetails, { params: { openBidId } })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getAwardedBidDetails = (awardedBidId) => (dispatch) => {
  //update store with the request details
  dispatch({
    type: A.TASKER_ACTIONS.GET_AWARDED_BID_DETAILS,
    payload: axios
      .get(ROUTES.API.BID.GET.awardedBidDetailsForTasker, { params: { awardedBidId } })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getArchivedBidDetailsForTasker = (bidId) => (dispatch) => {
  if (!bidId) {
    return;
  }
  dispatch({
    type: A.REQUEST_ACTIONS.SELECT_ARCHIVE_REQUEST,
    payload: { data: {} },
  });

  return dispatch({
    type: A.TASKER_ACTIONS.GET_ARCHIVED_BID_DETAILS_FOR_TASKER,
    payload: axios
      .get(ROUTES.API.BID.GET.achivedBidDetailsForTasker, { params: { bidId } })
      .then((resp) => {
        if (resp && resp.data) {
          dispatch({
            type: A.TASKER_ACTIONS.SELECT_ARCHIVED_BID,
            payload: { data: resp.data },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
