import React from 'react';

import AcceptBidAndBidderModal from './AcceptBidAndBidderModal';
import { UserImageAndRating } from '../../commonComponents';
export default class ReviewBidAndBidder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAcceptModal: false,
    };
  }

  toggleAcceptModal = () => {
    this.setState({ showAcceptModal: !this.state.showAcceptModal });
  };

  render() {
    const { bid, handleCancel } = this.props;

    if (!bid || !bid._id || !bid._bidderRef) {
      return null;
    }

    const { showAcceptModal } = this.state;
    const { displayName } = bid._bidderRef;

    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <React.Fragment>
        {showAcceptModal && (
          <AcceptBidAndBidderModal closeModal={this.toggleAcceptModal} bid={bid} />
        )}
        {!showAcceptModal && (
          <div className="card disabled">
            <header className="card-header">
              <p className="card-header-title">{`${displayName} 's Bid`}</p>
            </header>
            <div className="card-content">
              <UserImageAndRating userDetails={bid._bidderRef} />

              <div className="content">
                <label className="label"> Bid Amount</label>
                <div className="is-size-3 has-text-success has-text-weight-bold">{`${bidAmount} ${bidCurrency}`}</div>
                <label className="label">What's Next?</label>
                <div className="help">
                  * When you Accept a bid you will be asked to put your payment details
                </div>
                <div className="help">
                  * When the payment is secured both you and the bidder will recieve an email which
                  will share your contact details
                </div>
                <div className="help">
                  * When the job is completed. You will get a chance to rate the Bidder and the bid
                  amount will be deducted
                </div>

                <a
                  style={{ marginLeft: 8, marginTop: 8, width: '15rem' }}
                  onClick={this.toggleAcceptModal}
                  className="button is-success"
                >
                  <span className="icon">
                    <i className="far fa-handshake" />
                  </span>
                  <span>Accept Bid</span>
                </a>
                <a
                  style={{ marginLeft: 8, marginTop: 8, width: '15rem' }}
                  onClick={handleCancel}
                  className=" button is-outlined"
                >
                  <span className="icon">
                    <i className="far fa-arrow-alt-circle-left" />
                  </span>
                  <span>Go Back</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
