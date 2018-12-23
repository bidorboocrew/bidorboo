import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StripeCheckout from 'react-stripe-checkout';

import logoImg from '../../../assets/images/android-chrome-192x192.png';

import { submitPayment } from '../../../app-state/actions/paymentActions';

const BIDORBOO_SERVICECHARGE = 0.06;

class AcceptBidPaymentHandling extends React.Component {
  onTokenResponse = (clientStripeToken) => {
    const { bid, onCompleteHandler, a_submitPayment } = this.props;

    if (clientStripeToken && clientStripeToken.id) {
      a_submitPayment({
        stripeTransactionToken: clientStripeToken.id,
        bid: bid,
        chargeAmount: this.chargeAmount,
      });

      if (onCompleteHandler && typeof onCompleteHandler === 'function') {
        onCompleteHandler();
      }
    }
  };

  render() {
    const { bid } = this.props;

    // confirm award and pay
    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);
    let totalAmount = bidAmount + bidOrBooServiceFee;

    this.chargeAmount = totalAmount * 100; // as stipe checkout expects cents so 100 cent is 1 dollar
    return (
      <StripeCheckout
        name="BidOrBoo"
        image={logoImg}
        description="Secure payment using Stripe"
        amount={this.chargeAmount}
        currency="CAD"
        zipCode
        billingAddress
        token={this.onTokenResponse}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="button is-primary">BidOrBoo Payment</button>
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
)(AcceptBidPaymentHandling);
