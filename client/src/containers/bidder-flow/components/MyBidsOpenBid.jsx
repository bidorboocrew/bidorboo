import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, UserImageAndRating, StartDateAndTime } from '../../commonComponents';
import { BID_STATUS_TO_DISPLAYLABEL } from './helperComponents';

export default class MyBidsOpenBid extends React.Component {
  render() {
    const { bidDetails, deleteOpenBid } = this.props;
    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${bidDetails.bidAmount.currency}`;

    const fromTemplateId = _jobRef.fromTemplateId;

    const { _ownerRef } = _jobRef;

    const startingDateAndTime = moment(_jobRef.startingDateAndTime)
      .format('DD/MMM/YYYY')
      .toString();

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          switchRoute(`${ROUTES.CLIENT.BIDDER.reviewMyBidAndTheRequestDetails}/${bidDetails._id}`);
        }}
        className="card bidderRootSpecial"
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
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div style={{ paddingTop: 0, paddingBottom: 0 }} className="card-content">
          <div className="has-text-dark is-size-7">Requester:</div>
          <UserImageAndRating userDetails={_ownerRef} />

          <div className="content">
            <StartDateAndTime date={_jobRef.startingDateAndTime} />
            <DisplayLabelValue labelText="Your Bid:" labelValue={bidAmountText} />
            <div className="help">* waiting for requester to award.</div>
            <div style={{ margin: '0.5rem 0px' }} className="has-text-centered">
              <a className="button is-outlined is-fullwidth">View Or Change</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
