import React from 'react';
import moment from 'moment';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, CountDownComponent, UserImageAndRating } from '../../commonComponents';

export default class JobSummaryForAwarded extends React.Component {
  render() {
    const { job } = this.props;
    const { startingDateAndTime, fromTemplateId } = job;

    const { _awardedBidRef } = job;
    const { bidAmount, _bidderRef } = _awardedBidRef;

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${job._id}`);
        }}
        className="card bidderRootSpecial is-clipped"
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>

          <a className="card-header-icon has-text-success">
            <span className="icon">
              <i className="fas fa-hand-holding-usd" />
            </span>
            <span>{bidAmount && ` ${bidAmount.value} ${bidAmount.currency}`}</span>
          </a>
        </header>

        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Awarded Bidder:</div>
          <UserImageAndRating userDetails={_bidderRef} />

          <div className="content">
            <DisplayLabelValue
              labelText="Task Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('DD/MMM/YYYY')}`
              }
            />
          </div>
        </div>
        {renderFooter()}
        <CountDownComponent startingDate={startingDateAndTime.date} />
      </div>
    );
  }
}

let renderFooter = () => (
  <footer className="card-footer">
    <div className="card-footer-item">
      <a className="button is-success is-fullwidth ">
        <span className="icon">
          <i className="fa fa-hand-paper" />
        </span>
        <span>Contact</span>
      </a>
    </div>
  </footer>
);
