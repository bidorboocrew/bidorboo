import React from 'react';
import moment from 'moment';
import * as C from '../../../constants/constants';

export default class ReviewBidAndBidder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAcceptModal: false,
    };
  }

  render() {
    const { bid } = this.props;

    if (!bid || !bid._id || !bid._bidderRef) {
      return null;
    }

    const {
      rating,
      membershipStatus,
      createdAt,
      displayName,
      profileImage,
      email,
      phone,
    } = bid._bidderRef;

    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <div
        style={{ borderRight: 0, background: '#363636', color: 'white' }}
        className="card bidderRootSpecial is-clipped disabled"
      >
        <div className="card-content">
          <div
            style={{ paddingTop: '0.5rem' }}
            className="has-text-weight-bold is-size-5 has-text-success"
          >
            Awarded Bidder
          </div>

          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={bidderProfileImgUrl} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="is-size-6">{displayName}</p>
              <p className="is-size-6">{bidderOverallRating}</p>
            </div>
          </div>

          <div className="is-size-7">
            <a
              style={{ textDecoration: 'underline' }}
              className=" has-text-light"
              target="_blank"
              rel="noopener noreferrer"
              href="www.google.com"
            >
              {`View ${displayName} profile page.`}
            </a>
          </div>
          <br />
          <div className="has-text-weight-bold is-size-5 has-text-success">Contact Info</div>
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
          <DisplayLabelValue
            labelText="Phone Number:"
            labelValue={phone.phoneNumber || 'not provided'}
          />
          <DisplayLabelValue labelText="Bid Amount :" labelValue={`${bidAmount} ${bidCurrency}`} />
        </div>
      </div>
    );
  }
}

const DisplayLabelValue = (props) => {
  return (
    <div>
      <div className="has-text-dark is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
    </div>
  );
};
