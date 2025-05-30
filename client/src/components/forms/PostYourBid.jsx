import React from 'react';

import BidModal from './BidModal';

export default class PostYourBid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBidDialog: false,
    };
  }
  closeShowBidDialog = () => {
    this.setState({ showBidDialog: false });
  };

  openShowBidDialog = () => {
    const { isLoggedIn, showLoginDialog, taskerCanBid } = this.props;
    const elmnt = document.querySelector('#bob-taskerVerificationBanner');

    if (!isLoggedIn) {
      showLoginDialog(true);
    } else if (elmnt) {
      elmnt && elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
    } else {
      this.setState({ showBidDialog: true });
    }
  };

  render() {
    const { showBidDialog } = this.state;

    return (
      <>
        <div className="centeredButtonInCard">
          <button
            onClick={this.openShowBidDialog}
            type="button"
            id="bob-bid-on-request"
            className={`button is-success is-medium`}
          >
            <span className="icon">
              <i className="fas fa-hand-paper" />
            </span>
            <span>Enter Your Bid</span>
          </button>
          {showBidDialog && <BidModal {...this.props} handleClose={this.closeShowBidDialog} />}
        </div>
      </>
    );
  }
}
