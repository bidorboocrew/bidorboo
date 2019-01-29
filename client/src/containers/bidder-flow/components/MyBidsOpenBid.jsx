import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  AvgBidDisplayLabelAndValue,
  DisplayLabelValue,
  CountDownComponent,
  UserImageAndRating,
  JobStats,
  CardTitleWithBidCount,
  getDaysSinceCreated,
  StartDateAndTime,
} from '../../commonComponents';
import { BID_STATUS_TO_DISPLAYLABEL } from './helperComponents';

export default class MyBidsOpenBid extends React.Component {
  render() {
    const { bidDetails } = this.props;
    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${bidDetails.bidAmount.currency}`;
    const bidStateText = BID_STATUS_TO_DISPLAYLABEL[`${bidDetails.state}`] || bidDetails.state;

    const fromTemplateId = _jobRef.fromTemplateId;

    const { _ownerRef } = _jobRef;
    const { profileImage, displayName } = _ownerRef;

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
          </div>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <a className="button is-outlined">View Or Change</a>
          </div>
          <div className="card-footer-item">{`Task Date : ${startingDateAndTime}`}</div>
          {/* <div className="card-footer-item">
            <span className="has-text-weight-bold">{bidStateText}</span>
          </div> */}
        </footer>
      </div>
    );
  }
}
