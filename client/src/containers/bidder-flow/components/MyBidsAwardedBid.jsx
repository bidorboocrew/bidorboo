import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import { BID_STATUS_TO_DISPLAYLABEL } from './helperComponents';

export default class MyBidsAwardedBid extends React.Component {
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
      <div
        onClick={(e) => {
          e.preventDefault();
          updateBidState(bidDetails._id, 'WON_SEEN');
          switchRoute(`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bidDetails._id}`);
        }}
        className="card has-text-centered bidderRootSpecial"
      >
        <div style={{ paddingTop: 0, paddingBottom: 0 }} className="card-content">
          <div className="content">
            <p className="heading">Requester</p>
            <figure style={{ margin: '0 auto' }} className="image is-48x48">
              <img alt="profile" src={profileImage.url} />
            </figure>
            <div className="help">{displayName}</div>
            <p className="heading">Service Type</p>
            <p className="subtitle">{fromTemplateId}</p>
            <p className="heading">Bid Amount</p>
            <p style={{ marginBottom: 10 }} className="subtitle has-text-weight-bold">
              {bidAmountText}
            </p>
          </div>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item" style={{ position: 'relative' }}>
            <a className="button is-outlined is-success">View Details</a>
            {updatedStatus && (
              <div
                style={{ position: 'absolute', top: 14, right: 18, fontSize: 10 }}
                className="has-text-danger"
              >
                <i className="fas fa-circle" />
              </div>
            )}
          </div>

          <div className="card-footer-item">
            {`Task Date : ${moment(_jobRef.startingDateAndTime.date).format('DD/MMM/YYYY')}`}
          </div>
          {/* <div className="card-footer-item">
            <span className="has-text-weight-bold">{bidStateText}</span>
          </div> */}
        </footer>
      </div>
    );
  }
}
