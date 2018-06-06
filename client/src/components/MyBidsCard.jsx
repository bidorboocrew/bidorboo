
import React from 'react';
import moment from 'moment';
import { Proptypes_bidModel } from '../client-server-interfaces';

export default class MyBidsCard extends React.Component {
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
    const startingDateText = `${moment(_job.startingDateAndTime.date).format(
      'MMMM Do YYYY'
    )} ${_job.startingDateAndTime.hours}:${_job.startingDateAndTime.minutes}  ${
      _job.startingDateAndTime.period
    }`;

    return (
      <div className="level myBidsCard is-clipped">
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Job Title</p>
            <p className="subtitle">{jobTitleText}</p>
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
            <p className="heading">Starting Date Text</p>
            <p className="subtitle">{startingDateText}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Bid Amount</p>
            <p className="subtitle">{bidAmountText}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Bid State</p>
            <p className="subtitle">{bidStateText}</p>
          </div>
        </div>
      </div>
    );
  }
}
