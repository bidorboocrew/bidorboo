import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const updateRecentBid = (jobDetails) => (dispatch) => {
  dispatch({
    type: A.BIDDER_ACTIONS.UPDATE_RECENTLY_ADDED_BIDS,
    payload: { data: jobDetails },
  });
  // then rediret user to bid now page
  switchRoute(ROUTES.CLIENT.BIDDER.currentPostedBid);
};

export const selectJobToBidOn = (jobDetails) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON,
    payload: {
      jobDetails: jobDetails,
    },
  });
  // then rediret user to bid now page
  switchRoute(ROUTES.CLIENT.BIDDER.bidNow);
};

export const submitBid = ({ bidAmount, jobId }) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.BID.POST.bid, {
        data: {
          jobId: jobId,
          bidAmount: bidAmount,
        },
      })
      .then((resp) => {
        // update recently added job
        if (resp.data && resp.data._id) {
          dispatch({
            type: A.BIDDER_ACTIONS.UPDATE_RECENTLY_ADDED_BIDS,
            payload: { data: resp.data },
          });
          //rediret user to the current bid
          switchRoute(ROUTES.CLIENT.BIDDER.currentPostedBid);

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

export const getMyOpenBids = () => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_ALL_MY_OPEN_BIDS,
    payload: axios.get(ROUTES.API.BID.GET.myOpenBids).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};

export const getOpenBidDetails = (openBidId) => (dispatch) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_OPEN_BID_DETAILS,
    payload: axios.get(ROUTES.API.BID.GET.openBidDetails, { params: { openBidId } }).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};
