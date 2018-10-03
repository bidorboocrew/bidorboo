import React from 'react';
import moment from 'moment';
// import { Proptypes_bidModel } from '../../client-server-interfaces';

export default class BidDetailsCard extends React.Component {

  render() {
    const { bidDetails } = this.props;

    if (!bidDetails) {
      return null;
    }
    const { _job } = bidDetails;

    const bidAmountText = `${bidDetails.bidAmount.value} ${
      bidDetails.bidAmount.currency
    }`;
    const bidStateText = `${bidDetails.state}`;

    const jobTitleText = _job.title;
    const fromTemplateId = _job.fromTemplateId;
    const startingDateText = `${_job.startingDateAndTime.hours}:${
      _job.startingDateAndTime.minutes
    }  ${_job.startingDateAndTime.period}`;

    const { _ownerId } = _job;
    const { profileImage, displayName } = _ownerId;
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
                  <p className="heading">Owner Pic</p>
                  <figure style={{ margin: '0 auto' }} className="image is-32x32">
                  <img
                    alt="profile"
                    src={profileImage.url}
                    className="image is-32x32"
                  />
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
                  <p className="heading">Starting Time</p>
                  <p className="subtitle">{startingDateText}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Bid Amount</p>
                  <p className="subtitle has-text-weight-bold">
                    {bidAmountText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="card-footer">
          <a
            onClick={e => {
              alert('not implemented yet');
            }}
            className="card-footer-item"
          >
            Full Details
          </a>
          <div className="card-footer-item">
            {`Due : ${moment(_job.startingDateAndTime.date).format(
              'MMMM Do YYYY'
            )}`}
          </div>
          <div className="card-footer-item">
            <span className="has-text-weight-bold">{`${bidStateText}`}</span>
          </div>
        </footer>
      </div>
    );
  }
}
