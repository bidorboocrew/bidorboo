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
    this.setState({ showBidDialog: true });
  };

  render() {
    const { showBidDialog } = this.state;
    return (
      <React.Fragment>
        <a
          onClick={this.openShowBidDialog}
          type="button"
          className="button is-success is-medium is-outlined is-fullwidth"
        >
          <span className="icon">
            <i className="fas fa-hand-paper" />
          </span>
          <span>Place Your Bid</span>
        </a>

        {showBidDialog && <BidModal {...this.props} handleClose={this.closeShowBidDialog} />}
      </React.Fragment>
    );
  }
}
