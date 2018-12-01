import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

export default class AwardedBidDetailsCard extends React.Component {
  render() {
    const { bidDetails, notificationFeed } = this.props;

    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${bidDetails.bidAmount.currency}`;
    const bidStateText = `${bidDetails.state}`;

    const jobTitleText = _jobRef.title;
    const fromTemplateId = _jobRef.fromTemplateId;
    const startingDateText = `${_jobRef.startingDateAndTime.hours}:${
      _jobRef.startingDateAndTime.minutes
    }  ${_jobRef.startingDateAndTime.period}`;

    const { _ownerRef } = _jobRef;
    const { profileImage, displayName } = _ownerRef;

    let updatedStatus = false;
    if (notificationFeed && notificationFeed.myBidsWithNewStatus) {
      for (let i = 0; i < notificationFeed.myBidsWithNewStatus.length; i++) {
        if (notificationFeed.myBidsWithNewStatus[i]._id === bidDetails._id) {
          updatedStatus = true;
          break;
        }
      }
    }

    return (
      <div style={{ marginBottom: 14 }} className="card">
        <div className="card-content">
          <div className="content">
            <div className="level is-clipped">
              <div className="level-item has-text-centered">
                <div>
                  <img className="bdb-cover-img" src={`${profileImage.url}`} />
                  <div>
                    <p className="subtitle">{displayName}</p>
                  </div>
                </div>
              </div>

              <div className="level-item has-text-centered">
                <div>
                  <p className="is-size-6">Service Type</p>
                  <p className="subtitle">{fromTemplateId}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="is-size-6">Bid Amount</p>
                  <p className="subtitle has-text-weight-bold">{bidAmountText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="card-footer">
          <a
            onClick={(e) => {
              e.preventDefault();
              switchRoute(`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bidDetails._id}`);
            }}
            className="card-footer-item"
          >
            Bid Details
            {updatedStatus && (
              <span
                style={{
                  marginLeft: 4,
                }}
                className="tag is-dark"
              >
                New
              </span>
            )}
          </a>
          <div className="card-footer-item">
            {`Due : ${moment(_jobRef.startingDateAndTime.date).format(
              'MMMM Do YYYY',
            )} at ${startingDateText}`}
          </div>
          <div className="card-footer-item">
            <span className="has-text-weight-bold">{bidStateText}</span>
          </div>
        </footer>
      </div>
    );
  }
}
