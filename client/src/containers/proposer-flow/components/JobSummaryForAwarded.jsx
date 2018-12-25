import React from 'react';
import moment from 'moment';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import { DisplayLabelValue, CountDownComponent, UserImageAndRating } from '../../commonComponents';

export default class JobSummaryForAwarded extends React.Component {
  render() {
    const { job } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId } = job;

    const { _awardedBidRef } = job;
    const { bidAmount, _bidderRef } = _awardedBidRef;

    return (
      <div className="card bidderRootSpecial is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>
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
              labelText="Bid Amount:"
              labelValue={bidAmount && ` ${bidAmount.value} ${bidAmount.currency}`}
            />

            <DisplayLabelValue
              labelText="Job Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
          </div>
        </div>
        {renderFooter({ job })}
        <br />
        <CountDownComponent startingDate={startingDateAndTime.date} />
      </div>
    );
  }
}

let renderFooter = ({ job }) => (
  <footer className="card-footer">
    <div className="card-footer-item">
      <a
        className="button is-success is-fullwidth "
        onClick={(e) => {
          e.preventDefault();
          switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${job._id}`);
        }}
      >
        <span style={{ marginLeft: 4 }}>
          <i className="fa fa-hand-paper" /> Contact
        </span>
      </a>
    </div>
  </footer>
);
