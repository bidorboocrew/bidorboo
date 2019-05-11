import React from 'react';

import { switchRoute } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';

import { CountDownComponent, UserImageAndRating, StartDateAndTime } from '../../commonComponents';
import jobTemplateIdToDefinitionObjectMapper from '../../../bdb-tasks/jobTemplateIdToDefinitionObjectMapper';

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
          switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(job._id));
        }}
        className="card limitWidthOfCard"
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">
            {jobTemplateIdToDefinitionObjectMapper[fromTemplateId].TITLE}
          </p>

          <a className="card-header-icon has-text-success">
            <span className="icon">
              <i className="fas fa-hand-holding-usd" />
            </span>
            <span>{bidAmount && ` ${bidAmount.value} ${bidAmount.currency}`}</span>
          </a>
        </header>

        <div className="card-image is-clipped">
          <img
            className="bdb-cover-img"
            src={`${jobTemplateIdToDefinitionObjectMapper[fromTemplateId].IMG_URL}`}
          />
        </div>
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <div className="has-text-dark is-size-7">Awarded Tasker</div>
          <UserImageAndRating userDetails={_bidderRef} />

          <div className="content">
            <StartDateAndTime date={startingDateAndTime} />
          </div>
        </div>
        {renderFooter()}
        <CountDownComponent startingDate={startingDateAndTime} />
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
