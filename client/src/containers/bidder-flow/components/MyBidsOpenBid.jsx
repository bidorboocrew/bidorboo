import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

export default class MyOpenBidDetailsCard extends React.Component {
  render() {
    const { bidDetails } = this.props;
    if (!bidDetails) {
      return null;
    }
    const { _jobRef } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${bidDetails.bidAmount.currency}`;
    const bidStateText = `${bidDetails.state}`;

    const fromTemplateId = _jobRef.fromTemplateId;

    const { _ownerRef } = _jobRef;
    const { profileImage, displayName } = _ownerRef;
    return (
      <div style={{ marginBottom: 14 }} className="card">
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
              switchRoute(
                `${ROUTES.CLIENT.BIDDER.reviewMyBidAndTheRequestDetails}/${bidDetails._id}`,
              );
            }}
            className="card-footer-item"
          >
            View Details
          </a>
          <div className="card-footer-item">
            {`Due : ${moment(_jobRef.startingDateAndTime.date).format('MMMM Do YYYY')}`}
          </div>
          <div className="card-footer-item">
            <span className="has-text-weight-bold">{bidStateText}</span>
          </div>
        </footer>
      </div>
    );
  }
}
