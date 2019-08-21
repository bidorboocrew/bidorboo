import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import tasksDefinitions from '../../../bdb-tasks/tasksDefinitions';
import { DisplayLabelValue, UserImageAndRating, StartDateAndTime } from '../../commonComponents';

export default class MyBidsAwardedBid extends React.Component {
  render() {
    const { bidDetails, notificationFeed, updateBidState } = this.props;

    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${bidDetails.bidAmount.currency}`;

    const templateId = _jobRef.templateId;

    const { _ownerRef } = _jobRef;

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
          updateBidState(bidDetails._id, 'AWARDED_SEEN');
          switchRoute(
            ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bidDetails._id),
          );
        }}
        className="card limitWidthOfCard"
      >
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${tasksDefinitions[templateId].IMG_URL}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="group">
            <label className="label hasSelectedValue">Requester</label>
            <UserImageAndRating userDetails={_ownerRef} />
          </div>
          <div className="content">
            <StartDateAndTime date={_jobRef.startingDateAndTime} />
            <DisplayLabelValue labelText="Your pay:" labelValue={bidAmountText} />
            <div className="help">* After you complete the task.</div>
            <div style={{ padding: '0.5rem 0px', position: 'relative' }}>
              <a className="button is-success is-fullwidth">
                <span className="icon">
                  <i className="fas fa-bullseye" />
                </span>
                <span>Details</span>
              </a>
              {updatedStatus && (
                <div
                  style={{ position: 'absolute', top: 2, right: -4, fontSize: 10 }}
                  className="has-text-danger"
                >
                  <i className="fas fa-circle" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
