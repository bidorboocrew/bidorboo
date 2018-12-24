import React from 'react';

import { AddAwardedJobToCalendar } from './commonComponents';

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
        className="card bidderRootSpecial disabled"
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p style={{ color: 'white' }} className="card-header-title">
            Awarded Bidder Details
          </p>
        </header>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={bidderProfileImgUrl} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="is-size-6">{displayName}</p>
              <p className="is-size-6">{bidderOverallRating}</p>
              <a
                style={{ textDecoration: 'underline' }}
                className=" has-text-light"
                target="_blank"
                rel="noopener noreferrer"
                href="www.google.com"
              >
                {`View Full Profile`}
              </a>
            </div>
          </div>

          <div className="is-size-7" />
          <br />
          <div className="has-text-weight-bold is-size-5 has-text-success">Contact Info</div>
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
    <div>
      <div className="has-text-light is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
    </div>
  );
};
