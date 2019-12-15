import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification, delayedReload } from '../../utils';
import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';

export const getJobToBidOnDetails = (jobId, isLoggedIn = false) => (dispatch) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_JOB_To_BID_ON_DETAILS_BY_ID,
    payload: axios
      .get(ROUTES.API.JOB.GET.jobToBidDetailsById, { params: { jobId } })
      .then((resp) => {
        if (resp && resp.data) {
          if (isLoggedIn) {
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
          }
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

export const submitBid = ({ bidAmount, job, recaptchaField }) => (dispatch) => {
  //update store with the job details

  const { _id: jobId, templateId } = job;
  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.BID.POST.bid, {
        recaptchaField: recaptchaField,
        data: {
          jobId,
          bidAmount: bidAmount,
        },
      })
      .then((resp) => {
        // update recently added job
        if (resp.data && resp.data._id) {
          const taskDefinition = TASKS_DEFINITIONS[templateId];
          //rediret user to the current bid
          switchRoute(ROUTES.CLIENT.BIDDER.mybids);
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
          // xxxx update without reload
          window.location.reload();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const updateBid = ({ bidId, bidAmount, job }) => (dispatch) => {
  //update store with the job details
  const { templateId } = job;

  dispatch({
    type: A.BIDDER_ACTIONS.UPDATE_A_BID,
    payload: axios
      .post(ROUTES.API.BID.PUT.updateMyBid, {
        data: {
          bidId,
          bidAmount,
        },
      })
      .then((resp) => {
        // update recently added job
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
            ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(resp.data._id),
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
