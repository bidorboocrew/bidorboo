import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';

export const selectJobToBidOn = jobDetails => (dispatch, getState) => {
  //update store with the job details
  dispatch({
    type: A.BID_ACTIONS.SELECT_JOB_TO_BID_ON,
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

export const submitBid = ({ jobId, bidAmount }) => (dispatch, getState) => {
  //update store with the job details
  dispatch({
    type: A.JOB_ACTIONS.SEARCH_JOB,
    payload: axios
      .post(ROUTES.BACKENDROUTES.USERAPI.JOB_ROUTES.post_search, {
        data: {
          jobId: jobId,
          bidAmount: bidAmount
        }
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
