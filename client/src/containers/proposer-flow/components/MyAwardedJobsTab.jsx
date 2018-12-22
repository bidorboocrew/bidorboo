import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import JobSummaryCard from './JobSummaryCard';

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
        <JobSummaryCard
          cardClassName="card bidderRootSpecial is-clipped"
          {...props}
          job={job}
          renderFooter={() => (
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
          )}
        />
      </div>
    );
  });
  return myAwardedJobs;
};
