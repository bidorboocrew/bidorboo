import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';

export const selectJobToBidOn = jobDetails => (dispatch, getState) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON,
    payload: {
      jobDetails: jobDetails
    }
  });
  // then rediret user to bid now page
  dispatch({
    type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
    payload: { currentRoute: ROUTES.FRONTENDROUTES.BIDDER.bidNow }
  });
};

export const submitBid = ({ bidAmount, jobId }) => (dispatch, getState) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.BACKENDROUTES.USERAPI.BIDDER_ROUTES.post_a_bid, {
        data: {
          jobId: jobId,
          bidAmount: bidAmount
        }
      })
      .then(resp => {
        //rediret user to my bids page
        dispatch({
          type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
          payload: { currentRoute: ROUTES.FRONTENDROUTES.BIDDER.mybids }
        });

        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'success',
              msg: 'You have made your bid. Good Luck!'
            }
          }
        });
      })
      .catch(error => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg:
                'Sorry That did not work, Please try again later.\n' +
                (error && error.response && error.response.data
                  ? error.response.data
                  : error)
            }
          }
        });
      })
  });
};

export const getAllMyBids = () => (dispatch, getState) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.GET_ALL_MY_BIDS,
    payload: axios
      .get(ROUTES.BACKENDROUTES.USERAPI.BIDDER_ROUTES.get_all_my_bids)
      .catch(error => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg:
                'Sorry That did not work, Please try again later.\n' +
                (error && error.response && error.response.data
                  ? error.response.data
                  : error)
            }
          }
        });
      })
  });
};
