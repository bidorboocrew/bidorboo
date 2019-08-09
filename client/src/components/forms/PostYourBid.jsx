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
    const { userReadDetails, toggleShowMore } = this.props;
    const { showBidDialog } = this.state;

    return (
      <div className="centeredButtonInCard">
        {userReadDetails && (
          <button
            onClick={this.openShowBidDialog}
            type="button"
            id="bob-bid-on-request"
            className={`button is-success is-medium`}
          >
            <span className="icon">
              <i className="fas fa-hand-paper" />
            </span>
            {userReadDetails && <span>Bid on This Task</span>}
          </button>
        )}
        {!userReadDetails && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleShowMore();
            }}
            type="button"
            id="bob-bid-on-request"
            className={`button is-link`}
          >
            <span style={{ marginRight: 4 }}>Read Full Task Details</span>
            <span className="icon">
              <i className="fas fa-angle-double-down" />
            </span>
          </button>
        )}
        {showBidDialog && <BidModal {...this.props} handleClose={this.closeShowBidDialog} />}
      </div>
    );
  }
}
