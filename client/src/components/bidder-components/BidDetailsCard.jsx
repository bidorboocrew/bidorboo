import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

export default class BidDetailsCard extends React.Component {
  render() {
    const { bidDetails } = this.props;

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
    return (
      <div style={{ marginBottom: 14 }} className="card">
        <header className="card-header">
          <p className="card-header-title">{jobTitleText}</p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="level is-clipped">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Job Owner</p>
                  <figure style={{ margin: '0 auto' }} className="image is-32x32">
                    <img alt="profile" src={profileImage.url} className="image is-32x32" />
                  </figure>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Owner Name</p>
                  <p className="subtitle">{displayName}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Job Type</p>
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
              switchRoute(`${ROUTES.CLIENT.BIDDER.currentPostedBid}/${bidDetails._id}`);
            }}
            className="card-footer-item"
          >
            Bid Details
          </a>
          <div className="card-footer-item">
            {`Due : ${moment(_jobRef.startingDateAndTime.date).format(
              'MMMM Do YYYY'
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
