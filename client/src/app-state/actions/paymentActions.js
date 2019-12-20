import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const getMyStripeAccountDetails = () => (dispatch) =>
  dispatch({
    type: A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS,
    payload: axios.get(ROUTES.API.PAYMENT.GET.myStripeAccountDetails),
  });

export const submitPayment = ({ requestId, bidId }) => async (dispatch) => {
  if (!requestId || !bidId) {
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

  try {
    const {
      data: { sessionClientId },
    } = await axios.post(ROUTES.API.PAYMENT.POST.payment, {
      data: {
        requestId,
        bidId,
      },
    });

    await window.Stripe(`${process.env.REACT_APP_STRIPE_KEY}`).redirectToCheckout({
      sessionId: sessionClientId,
    });

    dispatch({
      type: A.REQUESTER_ACTIONS.AWARD_TASKER_AND_MAKE_A_PAYMENT,
      payload: window
        .Stripe(`${process.env.REACT_APP_STRIPE_KEY}`)
        .redirectToCheckout({
          sessionId: sessionClientId,
        })
        .then((resp) => {
          if (resp.data && resp.data.success) {
            switchRoute(ROUTES.CLIENT.REQUESTER.dynamicSelectedAwardedRequestPage(requestId));
          } else if (resp.data.error) {
            resp.error.safeMsg = resp.data.error.message;
            throwErrorNotification(dispatch, resp.data.error);
          }
        })
        .catch((error) => {
          throwErrorNotification(dispatch, error);
        }),
    });
  } catch (error) {
    throwErrorNotification(dispatch, error);
  }
};
