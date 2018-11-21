import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const submitPayment = ({ stripeTransactionToken, jobId, bidderId, chargeAmount }) => (
  dispatch,
) => {
  //update store with the job details
  dispatch({
    type: A.BIDDER_ACTIONS.POST_A_BID,
    payload: axios
      .post(ROUTES.API.PAYMENT.POST.payment, {
        data: {
          stripeTransactionToken,
          jobId,
          bidderId,
          chargeAmount,
        },
      })
      .then((resp) => {

        axios.get(ROUTES.API.PAYMENT.GET.payment).then((resp)=>{

        })
        debugger;
        // update recently added job
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
        debugger;
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
