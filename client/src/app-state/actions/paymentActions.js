import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';

export const submitPayment = ({ stripeTransactionToken, bid, chargeAmount }) => (dispatch) => {
  if (!bid || !bid._id || !bid._bidderRef) {
    dispatch({
      type: A.UI_ACTIONS.SHOW_TOAST_MSG,
      payload: {
        toastDetails: {
          type: 'error',
          msg:
            'Could Not Submi the payment as you are missing bid details. Please refresh and try again',
        },
      },
    });
    return;
  }

  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.PAYMENT.POST.payment, {
        data: {
          stripeTransactionToken,
          bidId: bid._id,
          chargeAmount: chargeAmount,
        },
      })
      .then((resp) => {
        axios.get(ROUTES.API.PAYMENT.GET.payment).then((resp) => {});
        // update recently added job
        debugger
        if (resp.data && resp.data.success) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'Your transaction was successul',
              },
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Your transaction was not successful. Please try again',
            },
          },
        });
      }),
  });
};
