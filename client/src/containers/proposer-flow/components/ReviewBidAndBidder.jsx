import React from 'react';

import AcceptBidAndBidderModal from './AcceptBidAndBidderModal';

// confirm award and pay
const BIDORBOO_SERVICECHARGE = 0.06;
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
    const {
      rating,
      membershipStatus,
      createdAt,
      displayName,
      profileImage,
      userId,
    } = bid._bidderRef;

    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;

    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    const bidOrBooServiceFee = Math.ceil(bidAmount * BIDORBOO_SERVICECHARGE);
    const totalAmount = bidAmount + bidOrBooServiceFee;

    return (
      <React.Fragment>
        {showAcceptModal && (
          <AcceptBidAndBidderModal closeModal={this.toggleAcceptModal} bit={bid} />
        )}
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">{`${displayName} 's Bid`}</p>
          </header>
          <div className="card-content">
            <div className="content">
              <div className="has-text-dark is-size-7"> Bid Amount :</div>
              <div className="is-size-3 has-text-primary has-text-weight-bold">{`${bidAmount} ${bidCurrency}`}</div>
              <div className="has-text-grey is-size-7">What's Next?</div>
              <div className="help">
                * When you Accept a bid you will be asked to put your payment details
              </div>
              <div className="help">
                * When the payment is secured both you and the bidder will recieve an email which
                will share your contact details
              </div>
              <div className="help">
                * When the job is completed. You will get a chance to rate the Bidder and the bid
                amount will be deducted`}
              </div>
            </div>
            <a
              style={{ marginLeft: 4, marginTop: 6, width: '15rem' }}
              onClick={this.toggleAcceptModal}
              className="button is-primary"
            >
              Accept Bid
            </a>
            <a
              style={{ marginLeft: 4, marginTop: 6, width: '15rem' }}
              onClick={handleCancel}
              className=" button is-outlined"
            >
              Go Back
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
