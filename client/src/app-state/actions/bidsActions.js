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
    payload: { currentRoute: ROUTES.CLIENT.BIDDER.bidNow }
  });
};

export const submitBid = ({ bidAmount, jobId }) => dispatch => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.BID.POST.bid, {
        data: {
          jobId: jobId,
          bidAmount: bidAmount
        }
      })
      .then(resp => {
        // update recently added job
        if (resp.data && resp.data._id) {
          dispatch({
            type: A.BIDDER_ACTIONS.UPDATE_RECENTLY_ADDED_BIDS,
            payload: { data: resp.data }
          });
          //rediret user to the current bid
          dispatch({
            type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
            payload: {
              currentRoute: ROUTES.CLIENT.BIDDER.currentPostedBid
            }
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
                  ? JSON.stringify(error.response.data)
                  : JSON.stringify(error))
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
      .get(ROUTES.API.BID.GET.myBids)
      .catch(error => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg:
                'Sorry That did not work, Please try again later.\n' +
                (error && error.response && error.response.data
                  ? JSON.stringify(error.response.data)
                  : JSON.stringify(error))
            }
          }
        });
      })
  });
};
