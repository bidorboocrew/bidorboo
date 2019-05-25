import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const selectJobToBidOn = (jobDetails) => (dispatch) => {
  dispatch({
    type: A.JOB_ACTIONS.UPDATE_JOB_VIEWED_BY,
    payload: axios
      .put(ROUTES.API.JOB.PUT.updateViewedBy, {
        data: {
          jobId: jobDetails._id,
        },
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON,
    payload: {
      jobDetails: jobDetails,
    },
  });

  switchRoute(ROUTES.CLIENT.BIDDER.getDynamicBidOnJobPage(jobDetails._id), { jobDetails });
};

export const getJobToBidOnDetails = (jobId) => (dispatch) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_JOB_To_BID_ON_DETAILS_BY_ID,
    payload: axios
      .get(ROUTES.API.JOB.GET.jobToBidDetailsById, { params: { jobId } })
      .then((resp) => {
        if (resp && resp.data) {
          dispatch({
            type: A.JOB_ACTIONS.UPDATE_JOB_VIEWED_BY,
            payload: axios
              .put(ROUTES.API.JOB.PUT.updateViewedBy, {
                data: {
                  jobId: resp.data._id,
                },
              })
              .catch((error) => {
                throwErrorNotification(dispatch, error);
              }),
          });

          //update store with the job details
          dispatch({
            type: A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON,
            payload: {
              jobDetails: resp.data,
            },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const submitBid = ({ bidAmount, jobId, recaptchaField }) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.BID.POST.bid, {
        recaptchaField,
        data: {
          jobId: jobId,
          bidAmount: bidAmount,
        },
      })
      .then((resp) => {
        // update recently added job
        if (resp.data && resp.data._id) {
          //rediret user to the current bid
          switchRoute(
            ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(resp.data._id),
          );

          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'You have made your bid. Good Luck!',
              },
            },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const deleteOpenBid = (bidId) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.DELETE_AN_OPEN_BID,
    payload: axios
      .delete(ROUTES.API.BID.DELETE.deleteOpenBid, {
        data: { bidId },
      })
      .then((resp) => {
        // update recently added job
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
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const cancelAwardedBid = (bidId) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.CANCEL_MY_AWARDED_BID,
    payload: axios
      .delete(ROUTES.API.BID.DELETE.cancelAwardedBid, {
        data: { bidId },
      })
      .then((resp) => {
        // update recently added job
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
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const updateBid = ({ bidId, bidAmount, recaptchaField }) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.UPDATE_A_BID,
    payload: axios
      .post(ROUTES.API.BID.PUT.updateMyBid, {
        recaptchaField,
        data: {
          bidId,
          bidAmount,
        },
      })
      .then((resp) => {
        // update recently added job
        if (resp.data && resp.data._id) {
          // xxxx update some store value instead of reloading the page
          window.location.reload();

          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'You have udpated your bid. Good Luck!',
              },
            },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const allMyPostedBids = () => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_ALL_MY_OPEN_BIDS,
    payload: axios.get(ROUTES.API.BID.GET.allMyPostedBids).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};

export const getOpenBidDetails = (openBidId) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_OPEN_BID_DETAILS,
    payload: axios
      .get(ROUTES.API.BID.GET.openBidDetails, { params: { openBidId } })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getMyAwardedBids = () => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_ALL_MY_AWARDED_BIDS,
    payload: axios.get(ROUTES.API.BID.GET.myAwardedBids).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};

export const getAwardedBidDetails = (awardedBidId) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_AWARDED_BID_DETAILS,
    payload: axios
      .get(ROUTES.API.BID.GET.awardedBidDetails, { params: { awardedBidId } })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const updateBidState = (bidId, newState) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.UPDATE_BID_STATE,
    payload: axios
      .put(ROUTES.API.BID.PUT.updateBidState, { data: { bidId, newState } })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
