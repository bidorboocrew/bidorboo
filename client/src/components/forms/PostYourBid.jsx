import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import BidModal from './BidModal';

export default class PostYourBid extends React.Component {
  constructor(props) {
    super(props);
    this.recaptchaRef = React.createRef();
    this.state = {
      showBidDialog: false,
      recaptcha: '',
    };
  }
  closeShowBidDialog = () => {
    this.setState({ showBidDialog: false });
  };

  openShowBidDialog = () => {
    this.setState({ showBidDialog: true });
  };

  componentDidMount() {
    if (this.recaptchaRef && this.recaptchaRef.current && this.recaptchaRef.current.execute) {
      this.recaptchaRef.current.execute();
    }
  }

  updateRecaptchaState = (val) => {
    console.log('got recaptcha');
    this.setState({ recaptcha: val });
  };

  render() {
    const { showBidDialog } = this.state;
    return (
      <div className="centeredButtonInCard">
        <ReCAPTCHA
          style={{ display: 'none' }}
          onExpired={() => this.recaptchaRef.current.execute()}
          ref={this.recaptchaRef}
          size="invisible"
          badge="bottomright"
          onChange={(result) => {
            this.updateRecaptchaState(result);
          }}
          sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
        />
        <a
          onClick={this.openShowBidDialog}
          type="button"
          id="bob-bid-on-request"
          className="button  is-success is-medium"
        >
          <span className="icon">
            <i className="fas fa-hand-paper" />
          </span>
          <span>Place Your Bid</span>
        </a>

        {showBidDialog && (
          <BidModal
            recaptcha={this.state.recaptcha}
            {...this.props}
            handleClose={this.closeShowBidDialog}
          />
        )}
      </div>
    );
  }
}
