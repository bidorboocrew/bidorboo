import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import { BID_STATUS_TO_DISPLAYLABEL } from './helperComponents';
export default class AwardedBidDetailsCard extends React.Component {
  render() {
    const { bidDetails, notificationFeed, updateBidState } = this.props;

    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${bidDetails.bidAmount.currency}`;
    const bidStateText = BID_STATUS_TO_DISPLAYLABEL[`${bidDetails.state}`] || bidDetails.state;

    const fromTemplateId = _jobRef.fromTemplateId;

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
      <div style={{ marginBottom: '3rem' }} className="card">
        <div style={{ paddingTop: 0, paddingBottom: 0 }} className="card-content">
          <div className="content">
            <div className="level is-clipped">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Requester</p>
                  <figure style={{ margin: '0 auto' }} className="image is-48x48">
                    <img alt="profile" src={profileImage.url} />
                  </figure>
                  <div className="help">{displayName}</div>
                </div>
              </div>

              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Service Type</p>
                  <p className="subtitle">{fromTemplateId}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Bid Amount</p>
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
              updateBidState(bidDetails._id, 'WON_SEEN');
              switchRoute(`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bidDetails._id}`);
            }}
            className="card-footer-item"
          >
            View Details
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
            {`Starts on : ${moment(_jobRef.startingDateAndTime.date).format('MMMM Do YYYY')}`}
          </div>
          <div className="card-footer-item">
            <span className="has-text-weight-bold">{bidStateText}</span>
          </div>
        </footer>
      </div>
    );
  }
}
