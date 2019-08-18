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
  onTokenResponse = (clientStripeToken) => {
    const { bid, onCompleteHandler, submitPayment } = this.props;

    if (clientStripeToken && clientStripeToken.id) {
      submitPayment({
        jobId: bid._jobRef,
        bidId: bid._id,
        chargeAmount: this.chargeAmount,
      });

      if (onCompleteHandler && typeof onCompleteHandler === 'function') {
        onCompleteHandler();
      }
    }
  };

  async componentDidMount() {
    const { bid } = this.props;

    try {
      const {
        data: { sessionClientId },
      } = await axios.post(ROUTES.API.PAYMENT.POST.payment, {
        data: {
          jobId: bid._jobRef,
          bidId: bid._id,
        },
      });
      debugger;
      const checkoutResults = await window
        .Stripe(`${process.env.REACT_APP_STRIPE_KEY}`)
        .redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: sessionClientId,
        });
      debugger;
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const { bid } = this.props;

    // confirm award and pay
    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);
    let totalAmount = bidAmount + bidOrBooServiceFee;

    this.chargeAmount = totalAmount * 100; // as stipe checkout expects cents so 100 cent is 1 dollar

    // https://github.com/azmenak/react-stripe-checkout
    return <div />;
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
