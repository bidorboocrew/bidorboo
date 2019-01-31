import React from 'react';
import ReactStars from 'react-stars';

import AcceptBidAndBidderModal from './AcceptBidAndBidderModal';

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
    const { rating, displayName, profileImage } = bid._bidderRef;

    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;

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
              <div className="media">
                <div
                  style={{
                    border: '1px solid #eee',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  }}
                  className="media-left"
                >
                  <figure className="image is-48x48">
                    <img src={bidderProfileImgUrl} alt="Placeholder image" />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="is-size-6">{displayName}</p>
                  {bidderOverallRating === 'No Ratings Yet' || bidderOverallRating === 0 ? (
                    <p className="is-size-6">No Ratings Yet</p>
                  ) : (
                    <ReactStars
                      className="is-size-6"
                      half
                      count={5}
                      value={bidderOverallRating}
                      edit={false}
                      size={25}
                      color1={'lightgrey'}
                      color2={'#ffd700'}
                    />
                  )}
                </div>
              </div>
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
                  Accept Bid
                </a>
                <a
                  style={{ marginLeft: 8, marginTop: 8, width: '15rem' }}
                  onClick={handleCancel}
                  className=" button is-outlined"
                >
                  Go Back
                </a>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
