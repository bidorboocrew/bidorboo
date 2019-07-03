import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StripeCheckout from 'react-stripe-checkout';

import logoImg from '../../../assets/images/android-icon-192x192.png';

import { submitPayment } from '../../../app-state/actions/paymentActions';
import ReCAPTCHA from 'react-google-recaptcha';

const BIDORBOO_SERVICECHARGE = 0.06;

class AcceptBidPaymentHandling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptchaField: '',
    };

    this.recaptchaRef = React.createRef();
  }

  updateRecaptchaField = (value) => {
    this.setState({ recaptchaField: value });
  };

  onTokenResponse = (clientStripeToken) => {
    const { bid, onCompleteHandler, submitPayment } = this.props;
    const { recaptchaField } = this.state;
    if (recaptchaField) {
      if (clientStripeToken && clientStripeToken.id) {
        submitPayment({
          jobId: bid._jobRef,
          stripeTransactionToken: clientStripeToken.id,
          bid: bid,
          chargeAmount: this.chargeAmount,
          recaptchaField: recaptchaField,
        });

        if (onCompleteHandler && typeof onCompleteHandler === 'function') {
          onCompleteHandler();
        }
      }
    } else {
      alert(
        'could not confirm that you are not a robot using Recaptcha, if you think this is a mistake please contact us directly at BidOrBooCrew@gmail.com ',
      );
    }
  };

  componentDidMount() {
    if (this.recaptchaRef && this.recaptchaRef.current && this.recaptchaRef.current.execute) {
      this.recaptchaRef.current.execute();
    }
  }

  render() {
    const { bid } = this.props;

    // confirm award and pay
    const bidAmount = bid.bidAmount.value;
    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);
    let totalAmount = bidAmount + bidOrBooServiceFee;

    this.chargeAmount = totalAmount * 100; // as stipe checkout expects cents so 100 cent is 1 dollar
    return (
      <React.Fragment>
        <ReCAPTCHA
          style={{ display: 'none' }}
          onExpired={() => this.recaptchaRef.current.execute()}
          ref={this.recaptchaRef}
          size="invisible"
          badge="bottomright"
          onChange={this.updateRecaptchaField}
          sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
        />
        <StripeCheckout
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
        >
          <button className="button is-success">Accept This Offer</button>
        </StripeCheckout>
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
