import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
// import StripeCheckout from 'react-stripe-checkout';

// import logoImg from '../../../assets/images/android-chrome-192x192.png';

import { submitPayment } from '../../../app-state/actions/paymentActions';

const BIDORBOO_SERVICECHARGE = 0.06;
// const x = `${process.env.REACT_APP_STRIPE_KEY}`;

// const stripe = window.Stripe && ;
class AcceptBidPaymentHandling extends React.Component {
  // onTokenResponse = (clientStripeToken) => {
  //   const { bid, onCompleteHandler, submitPayment } = this.props;

  //   if (clientStripeToken && clientStripeToken.id) {
  //     submitPayment({
  //       jobId: bid._jobRef,
  //       stripeTransactionToken: clientStripeToken.id,
  //       bid: bid,
  //       chargeAmount: this.chargeAmount,
  //     });

  //     if (onCompleteHandler && typeof onCompleteHandler === 'function') {
  //       onCompleteHandler();
  //     }
  //   }
  // };
  // async componentDidMount() {}

  toggleCheckout = async () => {
    const {
      data: {
        session: { id },
      },
    } = await axios.get('/api/requestCharge');
    debugger;

    const checkoutResponse = await window.Stripe(`${process.env.REACT_APP_STRIPE_KEY}`).redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: id,
    });
    debugger;
    // .then((result) => {
    //   // If `redirectToCheckout` fails due to a browser or network
    //   // error, display the localized error message to your customer
    //   // using `result.error.message`.
    // });
  };

  render() {
    const { bid } = this.props;

    // confirm award and pay
    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);
    let totalAmount = bidAmount + bidOrBooServiceFee;

    this.chargeAmount = totalAmount * 100; // as stipe checkout expects cents so 100 cent is 1 dollar
    return (
      <React.Fragment>
        {/* <StripeCheckout
          name="BidOrBoo"
          image={logoImg}
          description="Secure payment via stripe"
          amount={this.chargeAmount}
          currency="CAD"
          zipCode
          billingAddress
          allowRememberMe
          token={this.onTokenResponse}
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
        > */}
        <button onClick={this.toggleCheckout} className="button is-success">
          <span>Proceed to Checkout</span>
          <span className="icon">
            <i className="fas fa-chevron-right" />
          </span>
        </button>
        {/* </StripeCheckout> */}
      </React.Fragment>
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
