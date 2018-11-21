import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StripeCheckout from 'react-stripe-checkout';
import autoBind from 'react-autobind';
import logoImg from '../assets/images/android-chrome-192x192.png';
import { submitPayment } from '../app-state/actions/paymentActions';

class PaymentHandling extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this, 'onTokenResponse');
  }

  onTokenResponse(clientStripeToken) {
    ;
    if (clientStripeToken && clientStripeToken.id) {
      this.props.a_submitPayment({
        stripeTransactionToken: clientStripeToken.id,
        jobId: '5beb7cbc344b040068aa8347',
        bidderId: '5beb7a37344b040068aa8344',
        chargeAmount: 100,
      });
    }
    console.log(clientStripeToken);
  }

  render() {
    return (
      <StripeCheckout
        name="BidOrBoo"
        image={logoImg}
        description="Secure payment using Stripe"
        amount={100}
        currency="CAD"
        zipCode
        billingAddress
        // panelLabel=""
        token={this.onTokenResponse}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="button">Add Credits</button>
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
