import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const getMyStripeAccountDetails = () => (dispatch) =>
  dispatch({
    type: A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS,
    payload: axios.get(ROUTES.API.PAYMENT.GET.myStripeAccountDetails),
  });

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
    type: A.PROPOSER_ACTIONS.AWARD_BIDDER_AND_MAKE_A_PAYMENT,
    payload: axios
      .post(ROUTES.API.PAYMENT.POST.payment, {
        data: {
          jobId: bid._jobRef,
          stripeTransactionToken,
          bidId: bid._id,
          chargeAmount: chargeAmount,
        },
      })
      .then((resp) => {
        axios.get(ROUTES.API.PAYMENT.GET.payment).then((resp) => {});
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
          switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(bid._jobRef));
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
