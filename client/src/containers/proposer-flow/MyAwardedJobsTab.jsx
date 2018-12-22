import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
const TAB_IDS = {
  reviewBids: 'My Requests',
  inQueue: 'Awarded',
};

class MyAwardedJobsTab extends React.Component {
  render() {
    const { jobsList } = this.props;
    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <div className="columns is-multiline is-mobile">
        <AwardedRequests {...this.props} />
      </div>
    ) : (
      <EmptyStateComponent {...this.props} />
    );
  }
}

export default MyAwardedJobsTab;

const EmptyStateComponent = (props) => (
  <div className="column">
    <div className="card is-fullwidth">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">You have no awarded bidders.</div>
          <div className="help">Go to your requests tab, review the bids and select a bidder.</div>
          <br />
          <a
            className="button is-primary "
            onClick={(e) => {
              e.preventDefault();
              props.changeActiveTab(TAB_IDS.reviewBids);
            }}
          >
            My Requests
          </a>
        </div>
      </div>
    </div>
  </div>
);

const AwardedRequests = (props) => {
  const { jobsList } = props;

  const myAwardedJobs = jobsList.map((job) => {
    return (
      <div key={job._id} className="column">
        <MyAwardedJobSummaryCard job={job} {...props} />
      </div>
    );
  });
  return myAwardedJobs;
};

class MyAwardedJobSummaryCard extends React.Component {
  render() {
    const { job, userDetails, areThereAnyBidders, deleteJob } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId } = job;

    if (!templatesRepo[fromTemplateId]) {
      return null;
    }

    let daysSinceCreated = '';

    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
    } catch (e) {
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    return (
      <div style={{ border: '1px solid #23d160' }} className="card bidderRootSpecial is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header is-clipped"
        >
          <p className="card-header-title">{templatesRepo[fromTemplateId].title}</p>
        </header>
        <div className="card-image is-clipped">
          <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
        </div>

        <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }} className="card-content">
          <div className="content">
            <p className="is-size-7">
              Start Date
              {startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </p>
            <p className="is-size-7">
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`Posted (${daysSinceCreated} ago)`}
              </span>
            </p>
          </div>
        </div>
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
      </div>
    );
  }
}
