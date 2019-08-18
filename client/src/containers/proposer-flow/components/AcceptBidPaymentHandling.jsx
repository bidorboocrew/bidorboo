import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import StripeCheckout from 'react-stripe-checkout';

import logoImg from '../../../assets/images/android-chrome-192x192.png';

import { submitPayment } from '../../../app-state/actions/paymentActions';
import * as ROUTES from '../../../constants/frontend-route-consts';

const BIDORBOO_SERVICECHARGE = 0.06;

class AcceptBidPaymentHandling extends React.Component {
  // onTokenResponse = (clientStripeToken) => {
  //   const { bid, onCompleteHandler, submitPayment } = this.props;

  //   if (clientStripeToken && clientStripeToken.id) {
  //     submitPayment({
  //       jobId: bid._jobRef,
  //       bidId: bid._id,
  //       chargeAmount: this.chargeAmount,
  //     });

  //     if (onCompleteHandler && typeof onCompleteHandler === 'function') {
  //       onCompleteHandler();
  //     }
  //   }
  // };

  // async componentDidMount() {
  //   const { bid } = this.props;

  //   try {
  //     const {
  //       data: { sessionClientId },
  //     } = await axios.post(ROUTES.API.PAYMENT.POST.payment, {
  //       data: {
  //         jobId: bid._jobRef,
  //         bidId: bid._id,
  //       },
  //     });

  //     const checkoutResults = await window
  //       .Stripe(`${process.env.REACT_APP_STRIPE_KEY}`)
  //       .redirectToCheckout({
  //         // Make the id field from the Checkout Session creation API response
  //         // available to this file, so you can provide it as parameter here
  //         // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
  //         sessionId: sessionClientId,
  //       });
  //     debugger;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
  render() {
    const { submitPayment, bid } = this.props;

    // https://github.com/azmenak/react-stripe-checkout
    return (
      <button
        onClick={() => submitPayment({ jobId: bid._jobRef, bidId: bid._id })}
        className="button is-success"
      >
        <span>Proceed To Checkout</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitPayment: bindActionCreators(submitPayment, dispatch),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(AcceptBidPaymentHandling);
