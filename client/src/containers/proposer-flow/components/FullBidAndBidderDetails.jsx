import React from 'react';
import moment from 'moment';
import * as C from '../../../constants/constants';

import { BidderContactModal } from './BidderContactModal';

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
    const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
    const daysSinceCreated = createdAt
      ? moment.duration(moment().diff(moment(createdAt))).humanize()
      : 0;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <div className="card is-clipped disabled">
        <header className="card-header">
          <p className="card-header-title">{`Contact ${displayName}`}</p>
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
            </div>
          </div>
          <div className="is-size-7">
            {membershipStatusDisplay} active since {daysSinceCreated} ago
          </div>

          <div className="is-size-7">
            <a target="_blank" rel="noopener noreferrer" href="www.google.com">
              {`View ${displayName} profile page.`}
            </a>
          </div>
          <br />
          <div className="content">
            <div className="has-text-primary has-text-weight-bold">Contact Info: </div>
            <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
            <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
            <DisplayLabelValue
              labelText="Phone Number:"
              labelValue={phone.phoneNumber || 'not provided'}
            />
            <DisplayLabelValue
              labelText="Bid Amount :"
              labelValue={`${bidAmount} ${bidCurrency}`}
            />
          </div>
        </div>
      </div>
    );
  }
}

const DisplayLabelValue = (props) => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 12 }}>{props.labelText}</div>
      <div className="has-text-weight-bold is-size-5 is-primary">{props.labelValue}</div>
    </div>
  );
};
