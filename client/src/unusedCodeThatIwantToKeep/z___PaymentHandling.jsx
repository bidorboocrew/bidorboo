import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StripeCheckout from 'react-stripe-checkout';

import logoImg from '../assets/images/android-chrome-192x192.png';
import { submitPayment } from '../app-state/actions/paymentActions';

class PaymentHandling extends React.Component {
  onTokenResponse = (clientStripeToken) => {
    const { amount, bidderId, jobId, a_submitPayment, onCompleteHandler } = this.props;

    if (clientStripeToken && clientStripeToken.id) {
      a_submitPayment({
        stripeTransactionToken: clientStripeToken.id,
        jobId: jobId,
        bidderId: bidderId,
        chargeAmount: amount,
      });
      onCompleteHandler();
    }
  };

  componentDidMount() {
    const { beforePayment } = this.props;
    if (beforePayment && typeof beforePayment === 'function') {
      beforePayment();
    }
  }
  render() {
    const { amount, bidderId, jobId, a_submitPayment } = this.props;

    return (
      <StripeCheckout
        name="BidOrBoo"
        image={logoImg}
        description="Secure payment using Stripe"
        amount={amount}
        currency="CAD"
        zipCode
        billingAddress
        token={this.onTokenResponse}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="button is-success">Secure Payment</button>
      </StripeCheckout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    a_submitPayment: bindActionCreators(submitPayment, dispatch),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(PaymentHandling);
