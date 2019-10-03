import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import { DisplayLabelValue, UserImageAndRating, StartDateAndTime } from '../../commonComponents';
import tasksDefinitions from '../../../bdb-tasks/tasksDefinitions';

export default class MyBidsOpenBid extends React.Component {
  render() {
    const { bidDetails, deleteOpenBid } = this.props;
    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = bidDetails.bidAmount.value;

    const templateId = _jobRef.templateId;

    const { _ownerRef } = _jobRef;

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          switchRoute(
            ROUTES.CLIENT.BIDDER.dynamicReviewMyOpenBidAndTheRequestDetails(bidDetails._id),
          );
        }}
        className="card limitWidthOfCard"
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <a
            className="card-header-icon"
            aria-label="more options"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteOpenBid(bidDetails._id);
            }}
          >
            <span style={{ color: 'grey' }} className="icon">
              <i className="far fa-trash-alt" aria-hidden="true" />
            </span>
          </a>
        </header>
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${tasksDefinitions[templateId].IMG_URL}`} />
        </div>
        <div style={{ paddingTop: 0, paddingBottom: 0 }} className="card-content">
          <label className="label hasSelectedValue">Requester</label>
          <UserImageAndRating userDetails={_ownerRef} />

          <div className="content">
            <StartDateAndTime date={_jobRef.startingDateAndTime} />
            <DisplayLabelValue labelText="My Bid:" labelValue={bidAmountText} />
            <div className="help">* waiting for requester to award.</div>
            <div style={{ margin: '0.5rem 0px' }} className="has-text-centered">
              <a className="button is-fullwidth">View Or Change</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
