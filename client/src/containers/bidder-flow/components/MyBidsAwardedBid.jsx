import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, UserImageAndRating, StartDateAndTime } from '../../commonComponents';
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
        className="card bidderRootSpecial"
      >
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Requester:</div>
          <UserImageAndRating userDetails={_ownerRef} />

          <div className="content">
            <StartDateAndTime date={_jobRef.startingDateAndTime} />
            <DisplayLabelValue labelText="Your pay:" labelValue={bidAmountText} />
            <div className="help">* After you complete the task.</div>
          </div>
        </div>

        <footer className="card-footer">
          <div className="card-footer-item" style={{ position: 'relative' }}>
            <a className="button is-outlined is-success">
              <span className="icon">
                <i className="fas fa-glasses" />
              </span>
              <span>View Details</span>
            </a>
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
            {`Task Date : ${moment(_jobRef.startingDateAndTime).format('DD/MMM/YYYY')}`}
          </div>
          {/* <div className="card-footer-item">
            <span className="has-text-weight-bold">{bidStateText}</span>
          </div> */}
        </footer>
      </div>
    );
  }
}
