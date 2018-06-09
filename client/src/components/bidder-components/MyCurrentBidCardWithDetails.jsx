import React from 'react';
import moment from 'moment';
import { Proptypes_bidModel } from '../../client-server-interfaces';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

export default class MyCurrentBidCardWithDetails extends React.Component {
  static propTypes = {
    bidDetails: Proptypes_bidModel
  };

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

    return (
      <div className="card is-clipped">
        <header className="card-header">
          <p className="card-header-title">{jobTitleText}</p>
        </header>
        <div className="card-image is-clipped">
          <figure className="image is-3by1">
            <img
              src={
                templatesRepo[fromTemplateId] &&
                templatesRepo[fromTemplateId].imageUrl
                  ? templatesRepo[fromTemplateId].imageUrl
                  : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
              }
              alt="Placeholder"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <div className="level is-clipped">
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
            <div className="level is-clipped">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Approximate location</p>
                  <p className="subtitle">
                    {_job.addressText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="card-footer">
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
