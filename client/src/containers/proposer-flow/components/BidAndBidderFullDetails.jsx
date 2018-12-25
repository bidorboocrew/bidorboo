import React from 'react';

import { AddAwardedJobToCalendar } from './helperComponents';

export default class ReviewBidAndBidder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAcceptModal: false,
    };
  }

  render() {
    const { bid, job } = this.props;

    if (!bid || !bid._id || !bid._bidderRef) {
      return null;
    }

    const { rating, displayName, profileImage, email, phone } = bid._bidderRef;

    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <div
        style={{ borderRight: 0, background: '#363636', color: 'white' }}
        className="card disabled"
      >
        <header style={{ borderBottom: '1px solid white' }} className="card-header is-clipped">
          <p style={{ color: 'white' }} className="card-header-title">
            Awarded Bidder Details
          </p>
        </header>
        <div className="card-content">
          <div className="media">
            <div
              style={{
                border: '1px solid #eee',
                cursor: 'pointer',
                boxShadow:
                  '0 4px 6px rgba(255, 255, 255, 0.31), 0 1px 3px rgba(200, 200, 200, 0.08)',
              }}
              className="media-left"
            >
              <figure className="image is-48x48">
                <img src={bidderProfileImgUrl} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="is-size-6">{displayName}</p>
              <p className="is-size-6">{bidderOverallRating}</p>
            </div>
          </div>

          <div className="is-size-7" />
          <br />
          <div
            style={{ marginBottom: 6 }}
            className="has-text-weight-bold is-size-5 has-text-success"
          >
            Contact Info
          </div>
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
          <DisplayLabelValue
            labelText="Phone Number:"
            labelValue={phone.phoneNumber || 'not provided'}
          />
          <DisplayLabelValue labelText="Bid Amount :" labelValue={`${bidAmount} ${bidCurrency}`} />
          <br />
          <AddAwardedJobToCalendar job={job} />
        </div>
      </div>
    );
  }
}

const DisplayLabelValue = (props) => {
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="has-text-light is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
    </div>
  );
};
